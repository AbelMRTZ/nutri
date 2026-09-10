-- Calendario → "Programar plan": indefinite repetition. calendar_days stays
-- the sole source of truth the rest of the app reads from (per 0006's
-- comment) — there is still no abstract rule interpreted at read time.
-- Instead this table records a lightweight, disable-able intent ("plan X
-- repeats on weekdays Y"), and a generous batch of real calendar_days rows
-- is materialized upfront and topped up periodically (client-side, on
-- Calendar screen load, see useTopUpRecurringSchedules) as the lookahead
-- window runs low.

create table public.plan_recurring_schedules (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  -- Cascade (unlike calendar_days.plan_id, which is RESTRICT): this row is
  -- the *rule*, not a real assignment — if every calendar_days row that
  -- referenced the plan is gone (freeing it up for deletion), the schedule
  -- that produced them no longer means anything either.
  plan_id     uuid not null references public.plans(id) on delete cascade,

  weekdays    smallint[] not null,
  active      boolean not null default true,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint plan_recurring_schedules_weekdays_not_empty check (array_length(weekdays, 1) > 0)
);

-- Only one *active* schedule per plan: starting a second one while one is
-- already running would just create two competing top-up sources writing
-- the same calendar_days rows. The UI always disables the existing one
-- before offering to start another.
create unique index plan_recurring_schedules_one_active_per_plan
  on public.plan_recurring_schedules (plan_id)
  where active;

create index plan_recurring_schedules_plan_id_idx on public.plan_recurring_schedules (plan_id);

create trigger set_plan_recurring_schedules_updated_at
  before update on public.plan_recurring_schedules
  for each row execute function public.set_updated_at();

alter table public.plan_recurring_schedules enable row level security;

create policy "plan_recurring_schedules_select_own" on public.plan_recurring_schedules
  for select using (auth.uid() = user_id);

create policy "plan_recurring_schedules_insert_own" on public.plan_recurring_schedules
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.plans where plans.id = plan_recurring_schedules.plan_id and plans.user_id = auth.uid())
  );

create policy "plan_recurring_schedules_update_own" on public.plan_recurring_schedules
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "plan_recurring_schedules_delete_own" on public.plan_recurring_schedules
  for delete using (auth.uid() = user_id);

-- calendar_days gains a nullable tag back to the schedule that materialized
-- it, so disabling a schedule can clear exactly (and only) the future days
-- it created — never a day the user assigned or edited independently, and
-- never a past day (history is left alone).
alter table public.calendar_days
  add column plan_schedule_id uuid references public.plan_recurring_schedules(id) on delete set null;

create index calendar_days_plan_schedule_id_idx on public.calendar_days (plan_schedule_id);

-- Replace insert/update policies to also verify a plan_schedule_id, if set,
-- belongs to the same user — same defense-in-depth as the existing
-- plan_id/routine_id checks.
drop policy "calendar_days_insert_own" on public.calendar_days;
drop policy "calendar_days_update_own" on public.calendar_days;

create policy "calendar_days_insert_own" on public.calendar_days
  for insert with check (
    auth.uid() = user_id
    and (
      plan_id is null
      or exists (select 1 from public.plans where plans.id = calendar_days.plan_id and plans.user_id = auth.uid())
    )
    and (
      routine_id is null
      or exists (select 1 from public.routines where routines.id = calendar_days.routine_id and routines.user_id = auth.uid())
    )
    and (
      plan_schedule_id is null
      or exists (
        select 1 from public.plan_recurring_schedules
        where plan_recurring_schedules.id = calendar_days.plan_schedule_id
          and plan_recurring_schedules.user_id = auth.uid()
      )
    )
  );

create policy "calendar_days_update_own" on public.calendar_days
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and (
      plan_id is null
      or exists (select 1 from public.plans where plans.id = calendar_days.plan_id and plans.user_id = auth.uid())
    )
    and (
      routine_id is null
      or exists (select 1 from public.routines where routines.id = calendar_days.routine_id and routines.user_id = auth.uid())
    )
    and (
      plan_schedule_id is null
      or exists (
        select 1 from public.plan_recurring_schedules
        where plan_recurring_schedules.id = calendar_days.plan_schedule_id
          and plan_recurring_schedules.user_id = auth.uid()
      )
    )
  );
