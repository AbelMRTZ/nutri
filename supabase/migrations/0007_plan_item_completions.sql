-- Phase 3, slice 2: consumption tracking — a row marks one meal (plan_item)
-- of a calendar day's assigned plan as eaten. Existence of the row IS the
-- "consumed" flag (mirrors calendar_days: absence of state = not done yet),
-- so toggling a meal is insert-or-delete, never an update — no updated_at.
create table public.plan_item_completions (
  id                uuid primary key default gen_random_uuid(),
  calendar_day_id   uuid not null references public.calendar_days(id) on delete cascade,
  -- Unlike meal_items.food_id/plan_items.meal_id (RESTRICT, because Food/Meal
  -- are independently reusable catalog entities), a plan_item only exists
  -- inside one plan — removing a meal from a plan should cascade away any
  -- completion history for it rather than block the removal.
  plan_item_id      uuid not null references public.plan_items(id) on delete cascade,

  created_at        timestamptz not null default now(),

  constraint plan_item_completions_unique unique (calendar_day_id, plan_item_id)
);

create index plan_item_completions_calendar_day_id_idx on public.plan_item_completions (calendar_day_id);
create index plan_item_completions_plan_item_id_idx on public.plan_item_completions (plan_item_id);

alter table public.plan_item_completions enable row level security;

-- Ownership resolves through calendar_days. insert also verifies the
-- plan_item belongs to the plan currently assigned to that calendar day, so
-- a crafted request can't mark a meal from an unrelated plan as consumed.
create policy "plan_item_completions_select_own" on public.plan_item_completions
  for select using (
    exists (
      select 1 from public.calendar_days
      where calendar_days.id = plan_item_completions.calendar_day_id
        and calendar_days.user_id = auth.uid()
    )
  );

create policy "plan_item_completions_insert_own" on public.plan_item_completions
  for insert with check (
    exists (
      select 1 from public.calendar_days
      join public.plan_items on plan_items.plan_id = calendar_days.plan_id
      where calendar_days.id = plan_item_completions.calendar_day_id
        and calendar_days.user_id = auth.uid()
        and plan_items.id = plan_item_completions.plan_item_id
    )
  );

create policy "plan_item_completions_delete_own" on public.plan_item_completions
  for delete using (
    exists (
      select 1 from public.calendar_days
      where calendar_days.id = plan_item_completions.calendar_day_id
        and calendar_days.user_id = auth.uid()
    )
  );
