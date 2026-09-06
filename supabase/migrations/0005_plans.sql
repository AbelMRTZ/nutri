-- Phase 2, slice 3: plans ("Planes") — a plan combines meals (each at the
-- meal's own quantities, snapshotted so later edits never mutate the
-- original meal) into a full day's nutrition, either reading the user's
-- profile targets live (standard) or defining its own (special).

create table public.plans (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,

  name               text not null,
  is_special         boolean not null default false,

  -- Special-plan-only overrides; null for a standard plan (reads profiles'
  -- targets instead). Types match profiles' equivalent columns exactly.
  calories_target    integer,
  protein_g_target   numeric(6,1),
  carbs_g_target     numeric(6,1),
  fat_g_target       numeric(6,1),

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint plan_targets_match_special check (
    (is_special and calories_target is not null and protein_g_target is not null
       and carbs_g_target is not null and fat_g_target is not null)
    or
    (not is_special and calories_target is null and protein_g_target is null
       and carbs_g_target is null and fat_g_target is null)
  )
);

create index plans_user_id_name_idx on public.plans (user_id, name);

create trigger set_plans_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

alter table public.plans enable row level security;

create policy "plans_select_own" on public.plans
  for select using (auth.uid() = user_id);

create policy "plans_insert_own" on public.plans
  for insert with check (auth.uid() = user_id);

create policy "plans_update_own" on public.plans
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "plans_delete_own" on public.plans
  for delete using (auth.uid() = user_id);

-- plan_items: one meal placed into a plan, with a display order. meal_id
-- fulfils the RESTRICT-by-default FK promised in 0004_meals.sql's comment —
-- this is what finally makes MealListItem/MealDetailScreen's
-- "en uso en un plan" friendlyDeleteErrorMessage branch reachable.
-- Has updated_at because drag-reorder is a real update-in-place on
-- sort_order, unlike meal_items which are remove-and-re-add only.
create table public.plan_items (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.plans(id) on delete cascade,
  meal_id     uuid not null references public.meals(id),

  sort_order  integer not null default 0,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index plan_items_plan_id_idx on public.plan_items (plan_id);
create index plan_items_meal_id_idx on public.plan_items (meal_id); -- FK-check path

create trigger set_plan_items_updated_at
  before update on public.plan_items
  for each row execute function public.set_updated_at();

alter table public.plan_items enable row level security;

create policy "plan_items_select_own" on public.plan_items
  for select using (
    exists (select 1 from public.plans where plans.id = plan_items.plan_id and plans.user_id = auth.uid())
  );

create policy "plan_items_insert_own" on public.plan_items
  for insert with check (
    exists (select 1 from public.plans where plans.id = plan_items.plan_id and plans.user_id = auth.uid())
    and exists (select 1 from public.meals where meals.id = plan_items.meal_id and meals.user_id = auth.uid())
  );

create policy "plan_items_update_own" on public.plan_items
  for update using (
    exists (select 1 from public.plans where plans.id = plan_items.plan_id and plans.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.plans where plans.id = plan_items.plan_id and plans.user_id = auth.uid())
    and exists (select 1 from public.meals where meals.id = plan_items.meal_id and meals.user_id = auth.uid())
  );

create policy "plan_items_delete_own" on public.plan_items
  for delete using (
    exists (select 1 from public.plans where plans.id = plan_items.plan_id and plans.user_id = auth.uid())
  );

-- plan_item_foods: a per-plan snapshot of one food from the source meal_item
-- (food_id, quantity, is_variable copied at add-time). Editable in place when
-- is_variable=true — the whole point of this table existing separately from
-- meal_items is that edits here never touch the original meal or other plans.
-- food_id has no `on delete` clause (RESTRICT), same reasoning as meal_items.
create table public.plan_item_foods (
  id             uuid primary key default gen_random_uuid(),
  plan_item_id   uuid not null references public.plan_items(id) on delete cascade,
  food_id        uuid not null references public.foods(id),

  quantity       numeric(6,2) not null,
  is_variable    boolean not null,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint plan_item_foods_quantity_positive check (quantity > 0)
);

create index plan_item_foods_plan_item_id_idx on public.plan_item_foods (plan_item_id);
create index plan_item_foods_food_id_idx on public.plan_item_foods (food_id); -- FK-check path

create trigger set_plan_item_foods_updated_at
  before update on public.plan_item_foods
  for each row execute function public.set_updated_at();

alter table public.plan_item_foods enable row level security;

-- Two levels of indirection: plan_item_foods -> plan_items -> plans.
create policy "plan_item_foods_select_own" on public.plan_item_foods
  for select using (
    exists (
      select 1 from public.plan_items
      join public.plans on plans.id = plan_items.plan_id
      where plan_items.id = plan_item_foods.plan_item_id and plans.user_id = auth.uid()
    )
  );

create policy "plan_item_foods_insert_own" on public.plan_item_foods
  for insert with check (
    exists (
      select 1 from public.plan_items
      join public.plans on plans.id = plan_items.plan_id
      where plan_items.id = plan_item_foods.plan_item_id and plans.user_id = auth.uid()
    )
    and exists (select 1 from public.foods where foods.id = plan_item_foods.food_id and foods.user_id = auth.uid())
  );

create policy "plan_item_foods_update_own" on public.plan_item_foods
  for update using (
    exists (
      select 1 from public.plan_items
      join public.plans on plans.id = plan_items.plan_id
      where plan_items.id = plan_item_foods.plan_item_id and plans.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.plan_items
      join public.plans on plans.id = plan_items.plan_id
      where plan_items.id = plan_item_foods.plan_item_id and plans.user_id = auth.uid()
    )
    and exists (select 1 from public.foods where foods.id = plan_item_foods.food_id and foods.user_id = auth.uid())
  );

create policy "plan_item_foods_delete_own" on public.plan_item_foods
  for delete using (
    exists (
      select 1 from public.plan_items
      join public.plans on plans.id = plan_items.plan_id
      where plan_items.id = plan_item_foods.plan_item_id and plans.user_id = auth.uid()
    )
  );
