-- Real USDA data (Foundation Foods) occasionally reports a tiny negative
-- "Carbohydrate, by difference" (e.g. -0.475) — a known artifact of that
-- nutrient being computed as 100 minus protein/fat/water/ash, which can
-- undershoot zero by a hair when those add up to just over 100 due to
-- rounding. The import script must flag this (is_flagged/flag_reason),
-- never discard or alter the original value — so the hard "non-negative"
-- check added in 0011 was wrong: it rejected exactly the case the user
-- asked to keep, marked, not dropped. Validation of implausible amounts
-- belongs in the import script (a judgment call), not a DB constraint (a
-- hard rule that can only accept or reject, never "keep and flag").
alter table public.reference_food_nutrients
  drop constraint reference_food_nutrients_amount_non_negative;
