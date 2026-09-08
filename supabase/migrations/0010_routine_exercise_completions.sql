-- Phase 4, slice 3: workout session tracking — a row marks one exercise of
-- a calendar day's assigned routine as done. Same philosophy as
-- plan_item_completions: existence of the row IS the "done" flag, so
-- toggling is insert-or-delete, never an update — no updated_at. Cascades
-- on both sides for the same reason as plan_item_completions: a
-- routine_exercise only exists inside one routine, so removing it from the
-- routine should cascade away completion history rather than block it.
create table public.routine_exercise_completions (
  id                    uuid primary key default gen_random_uuid(),
  calendar_day_id       uuid not null references public.calendar_days(id) on delete cascade,
  routine_exercise_id   uuid not null references public.routine_exercises(id) on delete cascade,

  created_at            timestamptz not null default now(),

  constraint routine_exercise_completions_unique unique (calendar_day_id, routine_exercise_id)
);

create index routine_exercise_completions_calendar_day_id_idx on public.routine_exercise_completions (calendar_day_id);
create index routine_exercise_completions_routine_exercise_id_idx on public.routine_exercise_completions (routine_exercise_id);

alter table public.routine_exercise_completions enable row level security;

-- Ownership resolves through calendar_days. insert also verifies the
-- routine_exercise belongs to the routine currently assigned to that
-- calendar day, so a crafted request can't mark an exercise from an
-- unrelated routine as done.
create policy "routine_exercise_completions_select_own" on public.routine_exercise_completions
  for select using (
    exists (
      select 1 from public.calendar_days
      where calendar_days.id = routine_exercise_completions.calendar_day_id
        and calendar_days.user_id = auth.uid()
    )
  );

create policy "routine_exercise_completions_insert_own" on public.routine_exercise_completions
  for insert with check (
    exists (
      select 1 from public.calendar_days
      join public.routine_exercises on routine_exercises.routine_id = calendar_days.routine_id
      where calendar_days.id = routine_exercise_completions.calendar_day_id
        and calendar_days.user_id = auth.uid()
        and routine_exercises.id = routine_exercise_completions.routine_exercise_id
    )
  );

create policy "routine_exercise_completions_delete_own" on public.routine_exercise_completions
  for delete using (
    exists (
      select 1 from public.calendar_days
      where calendar_days.id = routine_exercise_completions.calendar_day_id
        and calendar_days.user_id = auth.uid()
    )
  );
