-- Shared, read-only food reference catalog (USDA FoodData Central today,
-- Mercadona-by-EAN reserved for later). Unlike `foods` (0003), rows here
-- belong to no user — they're global reference data, populated exclusively
-- by the `scripts/import-usda` pipeline running with the service role key.
-- Nothing here touches `foods`/`meal_items`/`plan_item_foods` or their RLS.

-- Extend the existing category enum so both the personal `foods` table and
-- this catalog can classify things like dairy/legumes/tubers/oils precisely
-- instead of falling back to 'other'. Additive and safe — existing rows are
-- unaffected. Flours/breads stay under 'grains_pasta'.
alter type food_category add value if not exists 'dairy';
alter type food_category add value if not exists 'legumes';
alter type food_category add value if not exists 'tubers';
alter type food_category add value if not exists 'oils_fats';

-- 'mercadona' is reserved for a future phase (products by EAN barcode) and
-- is not written by anything yet.
create type food_source as enum ('usda_foundation_foods', 'usda_sr_legacy', 'mercadona');

-- Nutrient dictionary — extensible, never limited to a fixed list. Grows
-- automatically as the import script sees new nutrients in the source data.
create table public.nutrients (
  id                 uuid primary key default gen_random_uuid(),

  usda_nutrient_nbr  text not null unique,  -- USDA's stable historical code (nutrient.nutrient_nbr), e.g. '203' = protein
  usda_nutrient_id   integer,               -- USDA's per-release surrogate id (nutrient.id) — NOT stable across releases, informational only

  name               text not null,        -- original USDA name (English), verbatim
  name_es            text,                 -- Spanish translation layer, nullable, curated by hand — never auto-generated
  unit               text not null,        -- unit as reported by USDA (G, MG, UG, KCAL...)
  rank               integer,               -- USDA's display rank

  created_at         timestamptz not null default now()
);

-- One row per catalog food. Not owned by a user — visible to every
-- authenticated user, writable only by the import script (service role,
-- which bypasses RLS entirely).
create table public.reference_foods (
  id                     uuid primary key default gen_random_uuid(),

  source                 food_source not null,
  source_id              text not null,              -- USDA fdc_id today (as text); EAN barcode for Mercadona later
  source_dataset         text,                        -- USDA food.data_type, verbatim (e.g. 'foundation_food')
  source_dataset_version text,                        -- e.g. '2026-04-30' — the dataset release actually imported
  imported_at            timestamptz not null default now(),

  name_original          text not null,               -- USDA food.description, verbatim, never edited
  name_es                text,                        -- Spanish display name layer, nullable
  category               food_category not null,
  usda_food_category_raw text,                        -- USDA food_category.description, kept to trace the mapping decision

  serving_type           food_serving_type not null default 'per_100g',
  ean_barcode            text,                        -- reserved for Mercadona, unused today

  is_flagged             boolean not null default false,
  flag_reason            text,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint reference_foods_source_unique unique (source, source_id)
);

create index reference_foods_category_idx on public.reference_foods (category);
create index reference_foods_name_search_idx
  on public.reference_foods using gin (to_tsvector('simple', coalesce(name_es, name_original)));

create trigger set_reference_foods_updated_at
  before update on public.reference_foods
  for each row execute function public.set_updated_at();

-- The single source of truth for every nutrient value, one row per
-- (food, nutrient) actually reported by the source. A nutrient the source
-- didn't measure simply has no row here — never a row with amount = 0.
create table public.reference_food_nutrients (
  id                 uuid primary key default gen_random_uuid(),
  reference_food_id  uuid not null references public.reference_foods(id) on delete cascade,
  nutrient_id        uuid not null references public.nutrients(id),

  amount             numeric not null,
  unit               text not null,                  -- copied from nutrients.unit at import time
  reference_basis    text not null default '100g',   -- explicit even though USDA's amount is always per-100g today

  source             food_source not null,            -- denormalized copy of reference_foods.source
  source_food_id     text not null,                   -- denormalized copy of reference_foods.source_id
  derivation_code    text,                            -- USDA food_nutrient_derivation.code (e.g. 'A' = analytical), nullable

  is_flagged         boolean not null default false,
  flag_reason        text,

  created_at         timestamptz not null default now(),

  -- Not-negative is a data-integrity guard (a negative nutrient amount can
  -- never be real), not a "suspicious range" check — those are judgment
  -- calls made by the import script's validation step, recorded via
  -- is_flagged/flag_reason without ever rejecting or altering the value.
  --
  -- CORRECTION (see 0012): this reasoning turned out to be wrong in
  -- practice. USDA's own Foundation Foods data occasionally reports a tiny
  -- negative "Carbohydrate, by difference" (e.g. -0.475) — an artifact of
  -- that nutrient being computed as 100 minus protein/fat/water/ash, which
  -- can undershoot zero by a hair on rounding. Rejecting it here would
  -- have dropped exactly the data the user asked to keep, marked, not
  -- discard — so 0012 removes this constraint and the import script flags
  -- negative amounts instead. Left as originally written (rather than
  -- edited away) so this migration still matches what was actually run.
  constraint reference_food_nutrients_amount_non_negative check (amount >= 0),
  constraint reference_food_nutrients_unique unique (reference_food_id, nutrient_id)
);

create index reference_food_nutrients_food_idx on public.reference_food_nutrients (reference_food_id);
create index reference_food_nutrients_nutrient_idx on public.reference_food_nutrients (nutrient_id);

alter table public.nutrients enable row level security;
alter table public.reference_foods enable row level security;
alter table public.reference_food_nutrients enable row level security;

-- Read-only for every authenticated user. No insert/update/delete policy
-- exists for the `authenticated` role on any of these three tables — only
-- the import script, using the service role key (which bypasses RLS), can
-- write here. This is the first shared/global data in the schema; every
-- other table so far is scoped per-user.
create policy "nutrients_select_all" on public.nutrients
  for select using (true);

create policy "reference_foods_select_all" on public.reference_foods
  for select using (true);

create policy "reference_food_nutrients_select_all" on public.reference_food_nutrients
  for select using (true);
