-- Records the barcode a food was imported from via Open Food Facts
-- ("Alimento por QR") — pure traceability, same spirit as
-- source_reference_food_id (0013) but no FK: Open Food Facts is a public
-- external API, not a table in this schema. Nullable and additive, no RLS
-- change (foods stays user_id-scoped only). No index: nothing queries by
-- this column (no cross-scan dedup requested) — deliberate, not an
-- oversight.
alter table public.foods
  add column source_barcode text;
