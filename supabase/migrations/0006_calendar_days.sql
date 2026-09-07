-- Phase 3, slice 1: calendar days ("Calendario") — one row per (user, date),
-- either pointing at a plan assigned to that day or marked as a free day
-- (mutually exclusive: a free day has no plan). The absence of a row for a
-- given date means "unplanned" — the app never pre-creates rows for every
-- date, only for ones the user has actually assigned or freed.
--
-- Deliberately does NOT yet have is_completed/score columns (future
-- meal-completion slice) or a recurrence/schedule table (future slice) —
-- both build additively on top of this table without needing to touch its
-- shape.

create table public.calendar_days (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  date        date not null,
  -- No `on delete` clause (defaults to RESTRICT): deleting a plan that is
  -- assigned to any calendar day raises 23503, finally activating the
  -- "plan is in use" friendlyDeleteErrorMessage guard already written (but
  -- until now unreachable) in PlanListItem.tsx / PlanDetailScreen.tsx.
  plan_id     uuid references public.plans(id),
  is_free     boolean not null default false,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint calendar_days_free_day_has_no_plan check (not (is_free and plan_id is not null)),
  constraint calendar_days_user_date_key unique (user_id, date)
);

-- Indexes the FK-check path Postgres runs whenever a plan is deleted.
create index calendar_days_plan_id_idx on public.calendar_days (plan_id);

create trigger set_calendar_days_updated_at
  before update on public.calendar_days
  for each row execute function public.set_updated_at();

alter table public.calendar_days enable row level security;

create policy "calendar_days_select_own" on public.calendar_days
  for select using (auth.uid() = user_id);

-- insert/update also verify the referenced plan belongs to the same user —
-- same defense-in-depth reasoning as meal_items verifying food_id and
-- plan_items verifying meal_id.
create policy "calendar_days_insert_own" on public.calendar_days
  for insert with check (
    auth.uid() = user_id
    and (
      plan_id is null
      or exists (select 1 from public.plans where plans.id = calendar_days.plan_id and plans.user_id = auth.uid())
    )
  );

create policy "calendar_days_update_own" on public.calendar_days
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and (
      plan_id is null
      or exists (select 1 from public.plans where plans.id = calendar_days.plan_id and plans.user_id = auth.uid())
    )
  );

create policy "calendar_days_delete_own" on public.calendar_days
  for delete using (auth.uid() = user_id);
