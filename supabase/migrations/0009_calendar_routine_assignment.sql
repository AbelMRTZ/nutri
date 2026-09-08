-- Phase 4, slice 2: assign a training routine to a calendar day, independent
-- of that day's nutrition plan/free-day state — eating "free" a given day
-- doesn't mean skipping the workout, and a diet day doesn't require one
-- either, so all four combinations are valid. Reuses calendar_days (one row
-- per user+date) instead of a new table: this is the same day, just a
-- second, orthogonal field on it. No `on delete` clause on routine_id
-- (RESTRICT), same reasoning as plan_id — deleting a routine assigned to a
-- day raises 23503, finally activating the "en uso" friendlyDeleteErrorMessage
-- guard already wired (but until now unreachable) in RoutineListItem/
-- RoutineDetailScreen.
alter table public.calendar_days
  add column routine_id uuid references public.routines(id);

create index calendar_days_routine_id_idx on public.calendar_days (routine_id);

-- Replace insert/update policies to also verify a routine_id, if set,
-- belongs to the same user — same defense-in-depth as the existing plan_id
-- check.
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
  );
