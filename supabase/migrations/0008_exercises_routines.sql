-- Phase 4, slice 1: Entrenamiento — a catalog of exercises and routines that
-- group them with sets/reps/weight, mirroring the foods/meals structure in
-- Despensa. No third tier yet (no "training plan" that assigns routines to
-- calendar days, the way plans do for meals) — that's a future slice.

create type exercise_muscle_group as enum (
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'core',
  'cardio',
  'full_body',
  'other'
);

create type exercise_equipment as enum (
  'bodyweight',
  'free_weights',
  'machine',
  'bands',
  'cardio_machine',
  'other'
);

create table public.exercises (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,

  name          text not null,
  muscle_group  exercise_muscle_group not null,
  equipment     exercise_equipment not null,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index exercises_user_id_name_idx on public.exercises (user_id, name);

create trigger set_exercises_updated_at
  before update on public.exercises
  for each row execute function public.set_updated_at();

alter table public.exercises enable row level security;

create policy "exercises_select_own" on public.exercises
  for select using (auth.uid() = user_id);

create policy "exercises_insert_own" on public.exercises
  for insert with check (auth.uid() = user_id);

create policy "exercises_update_own" on public.exercises
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "exercises_delete_own" on public.exercises
  for delete using (auth.uid() = user_id);

create table public.routines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  name        text not null,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index routines_user_id_name_idx on public.routines (user_id, name);

create trigger set_routines_updated_at
  before update on public.routines
  for each row execute function public.set_updated_at();

alter table public.routines enable row level security;

create policy "routines_select_own" on public.routines
  for select using (auth.uid() = user_id);

create policy "routines_insert_own" on public.routines
  for insert with check (auth.uid() = user_id);

create policy "routines_update_own" on public.routines
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "routines_delete_own" on public.routines
  for delete using (auth.uid() = user_id);

-- routine_exercises: one exercise placed into a routine with its own
-- sets/reps/weight and a display order. Unlike meal_items (remove-and-re-add
-- only), this supports in-place updates to both sort_order (drag-free
-- reorder, same as plan_items) AND sets/reps/weight — progressive overload
-- means bumping the weight on the same exercise is a extremely common edit,
-- so forcing remove-and-re-add here would be real UX friction, not just a
-- simplicity trade-off. exercise_id has no `on delete` clause (RESTRICT):
-- it's a reference to the reusable exercise catalog, same reasoning as
-- meal_items.food_id.
create table public.routine_exercises (
  id            uuid primary key default gen_random_uuid(),
  routine_id    uuid not null references public.routines(id) on delete cascade,
  exercise_id   uuid not null references public.exercises(id),

  sets          integer not null,
  reps          integer not null,
  weight_kg     numeric(6,2),

  sort_order    integer not null default 0,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint routine_exercises_sets_positive check (sets > 0),
  constraint routine_exercises_reps_positive check (reps > 0),
  constraint routine_exercises_weight_nonnegative check (weight_kg is null or weight_kg >= 0)
);

create index routine_exercises_routine_id_idx on public.routine_exercises (routine_id);
-- Indexes the FK-check path Postgres runs whenever an exercise is deleted.
create index routine_exercises_exercise_id_idx on public.routine_exercises (exercise_id);

create trigger set_routine_exercises_updated_at
  before update on public.routine_exercises
  for each row execute function public.set_updated_at();

alter table public.routine_exercises enable row level security;

-- routine_exercises has no user_id of its own; ownership always resolves
-- through its parent routine. insert/update also verify the referenced
-- exercise belongs to the same user, same defense-in-depth as meal_items.
create policy "routine_exercises_select_own" on public.routine_exercises
  for select using (
    exists (
      select 1 from public.routines
      where routines.id = routine_exercises.routine_id
        and routines.user_id = auth.uid()
    )
  );

create policy "routine_exercises_insert_own" on public.routine_exercises
  for insert with check (
    exists (
      select 1 from public.routines
      where routines.id = routine_exercises.routine_id
        and routines.user_id = auth.uid()
    )
    and exists (
      select 1 from public.exercises
      where exercises.id = routine_exercises.exercise_id
        and exercises.user_id = auth.uid()
    )
  );

create policy "routine_exercises_update_own" on public.routine_exercises
  for update using (
    exists (
      select 1 from public.routines
      where routines.id = routine_exercises.routine_id
        and routines.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.routines
      where routines.id = routine_exercises.routine_id
        and routines.user_id = auth.uid()
    )
    and exists (
      select 1 from public.exercises
      where exercises.id = routine_exercises.exercise_id
        and exercises.user_id = auth.uid()
    )
  );

create policy "routine_exercises_delete_own" on public.routine_exercises
  for delete using (
    exists (
      select 1 from public.routines
      where routines.id = routine_exercises.routine_id
        and routines.user_id = auth.uid()
    )
  );
