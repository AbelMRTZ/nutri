-- Phase 1: profiles table (registration/personalization data) + shared helpers
-- reused by all future feature tables (foods, meals, plans, calendar, training).

-- Reusable updated_at trigger function, defined once here for every future table.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create type sex_type as enum ('male', 'female');
create type goal_type as enum ('lose', 'maintain', 'gain');

create table public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,

  -- registration / personalization inputs
  age                    smallint,
  height_cm              numeric(5,1),
  weight_kg              numeric(5,1),
  sex                    sex_type,
  body_fat_pct           numeric(4,1),
  bmi                    numeric(4,1) generated always as (
                            case when height_cm > 0 and weight_kg is not null
                              then weight_kg / ((height_cm / 100.0) ^ 2)
                            end
                          ) stored,

  goal                   goal_type,
  target_weight_kg       numeric(5,1),
  pace_kg_per_week       numeric(3,2),

  -- computed (or user-overridden) daily targets, read by later phases (Calendario)
  calories_target        integer,
  protein_g_target       numeric(6,1),
  carbs_g_target         numeric(6,1),
  fat_g_target           numeric(6,1),
  macros_auto_calculated boolean not null default true,

  onboarding_completed   boolean not null default false,

  -- extensibility escape hatch for speculative/optional fields that don't
  -- yet need SQL-level querying; promote to a real column via migration once they do.
  extended               jsonb not null default '{}'::jsonb,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint target_requires_nonmaintain_goal
    check (goal = 'maintain' or target_weight_kg is not null),
  constraint pace_requires_nonmaintain_goal
    check (goal = 'maintain' or pace_kg_per_week is not null),
  constraint pace_in_range
    check (pace_kg_per_week is null or pace_kg_per_week between 0.1 and 0.7)
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-create a bare profile row the moment a user signs up, so the app can
-- rely on "a profile row always exists" and gate purely on onboarding_completed.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
