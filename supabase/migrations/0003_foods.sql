-- Phase 2, slice 1: personal foods database ("Alimentos"). Every nutrient
-- value is relative to the row's own serving_type (per 100 g, or per unit),
-- never normalized — the upcoming Comidas phase reads serving_type to decide
-- whether a meal_item's quantity is entered in grams or as a unit count.

create type food_serving_type as enum ('per_100g', 'per_unit');

create type food_category as enum (
  'fruit',
  'vegetable',
  'fish',
  'meat',
  'grains_pasta',
  'nuts',
  'sweets',
  'beverages',
  'supplements',
  'other'
);

create table public.foods (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,

  name                   text not null,
  serving_type           food_serving_type not null,
  category               food_category not null,

  -- required core macros
  energy_kcal            numeric(6,1) not null,
  fat_g                  numeric(6,2) not null,
  protein_g              numeric(6,2) not null,
  carbs_g                numeric(6,2) not null,

  -- optional fat detail
  saturated_fat_g        numeric(6,2),
  monounsaturated_fat_g  numeric(6,2),
  polyunsaturated_fat_g  numeric(6,2),

  -- optional other macros / misc
  fiber_g                numeric(6,2),
  sugar_g                numeric(6,2),
  salt_g                 numeric(6,2),
  omega3_g               numeric(6,2),
  cholesterol_mg         numeric(7,2),
  caffeine_mg            numeric(7,2),

  -- optional vitamins
  vitamin_c_mg           numeric(7,2),
  vitamin_a_mcg          numeric(8,2),
  vitamin_d_mcg          numeric(8,2),
  vitamin_e_mcg          numeric(8,2),
  vitamin_k_mcg          numeric(8,2),
  vitamin_b1_mg          numeric(7,2),
  vitamin_b2_mg          numeric(7,2),
  vitamin_b3_mg          numeric(7,2),
  vitamin_b5_mg          numeric(7,2),
  vitamin_b6_mg          numeric(7,2),
  vitamin_b7_mcg         numeric(8,2),
  vitamin_b8_mcg         numeric(8,2),
  vitamin_b12_mcg        numeric(8,2),

  -- optional minerals
  calcium_mg             numeric(7,2),
  iron_mg                numeric(7,2),
  magnesium_mg           numeric(7,2),
  phosphorus_mg          numeric(7,2),
  potassium_mg           numeric(7,2),
  sodium_mg              numeric(7,2),
  zinc_mg                numeric(7,2),

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- The list screen queries by (user_id, order by name); this index serves that directly.
create index foods_user_id_name_idx on public.foods (user_id, name);

create trigger set_foods_updated_at
  before update on public.foods
  for each row execute function public.set_updated_at();

alter table public.foods enable row level security;

create policy "foods_select_own" on public.foods
  for select using (auth.uid() = user_id);

create policy "foods_insert_own" on public.foods
  for insert with check (auth.uid() = user_id);

create policy "foods_update_own" on public.foods
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "foods_delete_own" on public.foods
  for delete using (auth.uid() = user_id);
