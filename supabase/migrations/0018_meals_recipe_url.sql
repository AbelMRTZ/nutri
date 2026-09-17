-- Optional link to an external recipe/video (YouTube, TikTok, Instagram, a
-- plain web page...) explaining how to prepare a meal. Nullable and
-- additive, no RLS change (meals stays user_id-scoped only) — same pattern
-- as foods.source_barcode (0017).
alter table public.meals
  add column recipe_url text;
