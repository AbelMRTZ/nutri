-- Rebuild of "Entrenamiento": the Ejercicios+Rutinas catalog (0008/0009/0010)
-- did not match what was actually asked for. Replaced with calorie-burning
-- activities (Fuerza/Carrera/Senderismo) assigned per day, calculated via
-- MET formulas or entered manually, that feed into that day's energy
-- balance. See PROGRESS.md for the full rationale.

-- ── Part 1: tear down the old training feature ─────────────────────────────

-- calendar_days_insert_own/update_own are currently defined by 0014 (which
-- replaced 0009's version to also check plan_schedule_id) and both reference
-- routine_id — they (and the column's own FK) must go before `routines` can
-- be dropped. Redefine them a third time here, this time dropping the
-- routine_id clause entirely while leaving the plan_id/plan_schedule_id
-- checks untouched. routine_exercise_completions_insert_own also reads
-- calendar_days.routine_id (to verify a completion belongs to the routine
-- actually assigned that day), so that table has to go before the column can
-- be dropped too.
drop policy "calendar_days_insert_own" on public.calendar_days;
drop policy "calendar_days_update_own" on public.calendar_days;

drop table public.routine_exercise_completions;

alter table public.calendar_days drop column routine_id;

drop table public.routine_exercises;
drop table public.routines;
drop table public.exercises;
drop type exercise_muscle_group;
drop type exercise_equipment;

create policy "calendar_days_insert_own" on public.calendar_days
  for insert with check (
    auth.uid() = user_id
    and (
      plan_id is null
      or exists (select 1 from public.plans where plans.id = calendar_days.plan_id and plans.user_id = auth.uid())
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
      plan_schedule_id is null
      or exists (
        select 1 from public.plan_recurring_schedules
        where plan_recurring_schedules.id = calendar_days.plan_schedule_id
          and plan_recurring_schedules.user_id = auth.uid()
      )
    )
  );

-- ── Part 2: calendar_activities + saved_activities ──────────────────────────
--
-- Deliberately NOT a child of calendar_days (unlike the old routine_id):
-- calendar_days rows only exist once something is assigned to them, and
-- forcing one into existence just to hang an activity off it would be pure
-- ceremony. Instead calendar_activities carries its own user_id + date,
-- exactly like calendar_days itself — several activities can exist for the
-- same date (no unique constraint), unlike calendar_days' one-row-per-day.

create type activity_type as enum ('strength', 'running', 'hiking');
create type activity_calculation_mode as enum ('auto', 'manual');
-- light/moderate/intense: Fuerza. easy/moderate/demanding/trail: Senderismo.
-- 'moderate' is shared at the enum level, but its MET/label is always
-- resolved in application code keyed by (activity_type, effort_level), never
-- ambiguously — enforced below by calendar_activities_effort_matches_type.
create type activity_effort_level as enum ('light', 'moderate', 'intense', 'easy', 'demanding', 'trail');

create table public.calendar_activities (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  date               date not null,

  activity_type      activity_type not null,
  name               text,
  calculation_mode   activity_calculation_mode not null,
  calories_burned    numeric(6,1) not null check (calories_burned >= 0),

  -- Auto-calculation inputs, populated only for the relevant activity_type;
  -- met_value/weight_kg_used are pure traceability (what was actually used),
  -- never re-derived live from a possibly-since-changed profile weight.
  duration_minutes   numeric(6,1) check (duration_minutes > 0),
  distance_km        numeric(6,2) check (distance_km > 0),
  effort_level       activity_effort_level,
  met_value          numeric(5,2),
  weight_kg_used     numeric(5,1),

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint calendar_activities_auto_requires_duration
    check (calculation_mode = 'manual' or duration_minutes is not null),
  constraint calendar_activities_running_requires_distance
    check (activity_type <> 'running' or calculation_mode = 'manual' or distance_km is not null),
  constraint calendar_activities_effort_matches_type check (
    (activity_type = 'strength' and (effort_level is null or effort_level in ('light', 'moderate', 'intense')))
    or (activity_type = 'hiking' and (effort_level is null or effort_level in ('easy', 'moderate', 'demanding', 'trail')))
    or (activity_type = 'running' and effort_level is null)
  )
);

create index calendar_activities_user_id_date_idx on public.calendar_activities (user_id, date);

create trigger set_calendar_activities_updated_at
  before update on public.calendar_activities
  for each row execute function public.set_updated_at();

alter table public.calendar_activities enable row level security;

create policy "calendar_activities_select_own" on public.calendar_activities
  for select using (auth.uid() = user_id);

create policy "calendar_activities_insert_own" on public.calendar_activities
  for insert with check (auth.uid() = user_id);

create policy "calendar_activities_update_own" on public.calendar_activities
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "calendar_activities_delete_own" on public.calendar_activities
  for delete using (auth.uid() = user_id);

-- saved_activities: reusable templates ("guardar entreno para reutilizarlo").
-- Same shape as calendar_activities minus `date`, plus a required `name` (it
-- has to be identifiable in a picker list, unlike a one-off logged activity).
create table public.saved_activities (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  name               text not null,

  activity_type      activity_type not null,
  calculation_mode   activity_calculation_mode not null,
  -- Preview value only for auto-mode templates — applying one to a day
  -- always recomputes with the profile's current weight, never copies this
  -- frozen number (see useApplySavedActivity).
  calories_burned    numeric(6,1) not null check (calories_burned >= 0),

  duration_minutes   numeric(6,1) check (duration_minutes > 0),
  distance_km        numeric(6,2) check (distance_km > 0),
  effort_level       activity_effort_level,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint saved_activities_auto_requires_duration
    check (calculation_mode = 'manual' or duration_minutes is not null),
  constraint saved_activities_running_requires_distance
    check (activity_type <> 'running' or calculation_mode = 'manual' or distance_km is not null),
  constraint saved_activities_effort_matches_type check (
    (activity_type = 'strength' and (effort_level is null or effort_level in ('light', 'moderate', 'intense')))
    or (activity_type = 'hiking' and (effort_level is null or effort_level in ('easy', 'moderate', 'demanding', 'trail')))
    or (activity_type = 'running' and effort_level is null)
  )
);

create index saved_activities_user_id_name_idx on public.saved_activities (user_id, name);

create trigger set_saved_activities_updated_at
  before update on public.saved_activities
  for each row execute function public.set_updated_at();

alter table public.saved_activities enable row level security;

create policy "saved_activities_select_own" on public.saved_activities
  for select using (auth.uid() = user_id);

create policy "saved_activities_insert_own" on public.saved_activities
  for insert with check (auth.uid() = user_id);

create policy "saved_activities_update_own" on public.saved_activities
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "saved_activities_delete_own" on public.saved_activities
  for delete using (auth.uid() = user_id);
