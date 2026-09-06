-- Phase 2, slice 2: meals ("Comidas") — a meal is a named, categorized
-- container for foods-with-quantities. meal_items has no user_id of its
-- own; ownership is always resolved through its parent meal.

create type meal_category as enum (
  'main',
  'breakfast',
  'pre_workout',
  'post_workout',
  'snack'
);

create table public.meals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  name        text not null,
  category    meal_category not null,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- The list screen queries by (user_id, order by name); this index serves that directly.
create index meals_user_id_name_idx on public.meals (user_id, name);

create trigger set_meals_updated_at
  before update on public.meals
  for each row execute function public.set_updated_at();

alter table public.meals enable row level security;

create policy "meals_select_own" on public.meals
  for select using (auth.uid() = user_id);

create policy "meals_insert_own" on public.meals
  for insert with check (auth.uid() = user_id);

create policy "meals_update_own" on public.meals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "meals_delete_own" on public.meals
  for delete using (auth.uid() = user_id);

-- meal_items: line items attaching a food + quantity to a meal. No updated_at
-- and no update flow in the app — a quantity change is a remove-and-re-add,
-- not an edit-in-place. food_id intentionally has NO `on delete` clause
-- (defaults to RESTRICT), so deleting an in-use food raises 23503 — the
-- Alimentos feature's friendlyDeleteErrorMessage already handles this.
create table public.meal_items (
  id           uuid primary key default gen_random_uuid(),
  meal_id      uuid not null references public.meals(id) on delete cascade,
  food_id      uuid not null references public.foods(id),

  quantity     numeric(6,2) not null,
  is_variable  boolean not null default false,

  created_at   timestamptz not null default now(),

  constraint meal_items_quantity_positive check (quantity > 0)
);

create index meal_items_meal_id_idx on public.meal_items (meal_id);
-- Indexes the FK-check path Postgres runs whenever a food is deleted.
create index meal_items_food_id_idx on public.meal_items (food_id);

alter table public.meal_items enable row level security;

-- meal_items has no user_id of its own: ownership always resolves through
-- its parent meal. insert/update also verify the referenced food belongs to
-- the same user — otherwise a crafted request could attach someone else's
-- food_id by guessing its uuid, bypassing the fact that it's never visible
-- in that user's own food picker.
create policy "meal_items_select_own" on public.meal_items
  for select using (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
        and meals.user_id = auth.uid()
    )
  );

create policy "meal_items_insert_own" on public.meal_items
  for insert with check (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
        and meals.user_id = auth.uid()
    )
    and exists (
      select 1 from public.foods
      where foods.id = meal_items.food_id
        and foods.user_id = auth.uid()
    )
  );

create policy "meal_items_update_own" on public.meal_items
  for update using (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
        and meals.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
        and meals.user_id = auth.uid()
    )
    and exists (
      select 1 from public.foods
      where foods.id = meal_items.food_id
        and foods.user_id = auth.uid()
    )
  );

create policy "meal_items_delete_own" on public.meal_items
  for delete using (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
        and meals.user_id = auth.uid()
    )
  );
