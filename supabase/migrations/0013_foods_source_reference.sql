-- Links a personal `foods` row back to the catalog food it was copied from
-- (via "Añadir a mis alimentos" in the new Investigar Alimentos screen) —
-- pure traceability, nothing reads or writes through this FK to compute
-- anything live. Nullable and additive: existing foods keep working
-- unchanged, no RLS policy on `foods` changes (still user_id-scoped only).
-- `on delete set null` because deleting a reference_foods row (shouldn't
-- normally happen — the import script only upserts) must never cascade
-- into deleting a user's own food or blocking the delete outright.
alter table public.foods
  add column source_reference_food_id uuid references public.reference_foods(id) on delete set null;

create index foods_source_reference_food_id_idx on public.foods (source_reference_food_id);
