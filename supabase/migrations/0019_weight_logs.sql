-- Weight tracking ("Registro de pesos"): one row per (user, date). Deliberately
-- independent from profiles.weight_kg (used elsewhere for macro/activity-calorie
-- calculations) — logging a weight here never touches the profile, it only ever
-- feeds the progression chart on Inicio. Same shape/RLS pattern as foods: a
-- flat user-owned table with no FKs to other domain tables.

create table public.weight_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  date        date not null,
  weight_kg   numeric(5,2) not null,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint weight_logs_user_date_key unique (user_id, date)
);

-- The chart/list query by (user_id, order by date); this index serves that directly.
create index weight_logs_user_id_date_idx on public.weight_logs (user_id, date);

create trigger set_weight_logs_updated_at
  before update on public.weight_logs
  for each row execute function public.set_updated_at();

alter table public.weight_logs enable row level security;

create policy "weight_logs_select_own" on public.weight_logs
  for select using (auth.uid() = user_id);

create policy "weight_logs_insert_own" on public.weight_logs
  for insert with check (auth.uid() = user_id);

create policy "weight_logs_update_own" on public.weight_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "weight_logs_delete_own" on public.weight_logs
  for delete using (auth.uid() = user_id);
