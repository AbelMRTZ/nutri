import type { OptionalNutrientField } from '@/features/foods/schema';

/**
 * Per-100g "low"/"high" cut-offs for each optional nutrient, sourced from
 * official standards — never a guessed number:
 * - Vitamins/minerals: 15% ("low"/"source of") and 30% ("high") of the EU
 *   Nutrient Reference Value (Regulation (EU) 1169/2011, Annex XIII +
 *   Regulation (EC) 1924/2006 claim conditions) — the same "% VRN" already
 *   printed on any EU nutrition label. 15% is exactly half of 30%, so
 *   `low` is always `high / 2` for this group — not a separate estimate.
 * - Saturated fat / sugar / salt: the UK FSA/Department of Health traffic-
 *   light "low"/"medium"/"high" cut-offs for solid foods (Table 2, "Guide
 *   to creating a front of pack (FoP) nutrition label", gov.uk, 2016) —
 *   these are NOT simply `high / 2` (e.g. saturated fat: low ≤1.5g,
 *   high >5g), so each is stated explicitly from the source table.
 * - Fibre / omega-3 (ALA): the EU nutrition-claims "source of" (low) /
 *   "high in" (high) thresholds (Regulation (EC) 1924/2006 Annex) — here
 *   `low` also happens to be exactly `high / 2` (3g/6g fibre, 0.3g/0.6g
 *   omega-3), confirmed against the regulation text, not assumed.
 * - Sodium: no NRV/claim exists for sodium itself — derived from the FSA
 *   salt cut-offs via the official sodium→salt conversion (salt = sodium
 *   × 2.5), used here only to colour the bar, never stored or presented
 *   as a "salt" value. The EU "low sodium" claim (≤0.12g sodium/100g)
 *   independently confirms this derived `low` value exactly.
 *
 * `null` means no official low/high standard exists for that nutrient
 * (mono/polyunsaturated fat are promoted as beneficial, not classified as
 * "high = bad"; cholesterol and caffeine have no EU/FSA claim threshold;
 * `vitamin_b8_mcg` isn't an officially recognised vitamin, so it has no
 * NRV) — these are shown without a level judgement rather than inventing
 * a cut-off.
 *
 * Note: `vitamin_e_mcg` is a pre-existing mislabelled column — the values
 * stored in it are actually milligrams, matching how the app has always
 * populated it (the vitamin E NRV, 12 mg, is applied directly here without
 * any µg→mg conversion for that reason).
 */
export type NutrientThreshold = { low: number | null; high: number | null };

export const NUTRIENT_THRESHOLDS: Record<OptionalNutrientField, NutrientThreshold> = {
  saturated_fat_g: { low: 1.5, high: 5 }, // FSA low/high saturated fat
  monounsaturated_fat_g: { low: null, high: null },
  polyunsaturated_fat_g: { low: null, high: null },
  fiber_g: { low: 3, high: 6 }, // EU "source of"/"high in" fibre
  sugar_g: { low: 5, high: 22.5 }, // FSA low/high sugars
  salt_g: { low: 0.3, high: 1.5 }, // FSA low/high salt
  omega3_g: { low: 0.3, high: 0.6 }, // EU "source of"/"high in" omega-3 (ALA)
  cholesterol_mg: { low: null, high: null },
  caffeine_mg: { low: null, high: null },
  vitamin_c_mg: { low: 12, high: 24 }, // 15%/30% of 80 mg NRV
  vitamin_a_mcg: { low: 120, high: 240 }, // 15%/30% of 800 µg NRV
  vitamin_d_mcg: { low: 0.75, high: 1.5 }, // 15%/30% of 5 µg NRV
  vitamin_e_mcg: { low: 1.8, high: 3.6 }, // 15%/30% of 12 mg NRV (column stores mg, see note above)
  vitamin_k_mcg: { low: 11.25, high: 22.5 }, // 15%/30% of 75 µg NRV
  vitamin_b1_mg: { low: 0.165, high: 0.33 }, // 15%/30% of 1.1 mg NRV
  vitamin_b2_mg: { low: 0.21, high: 0.42 }, // 15%/30% of 1.4 mg NRV
  vitamin_b3_mg: { low: 2.4, high: 4.8 }, // 15%/30% of 16 mg NRV
  vitamin_b5_mg: { low: 0.9, high: 1.8 }, // 15%/30% of 6 mg NRV
  vitamin_b6_mg: { low: 0.21, high: 0.42 }, // 15%/30% of 1.4 mg NRV
  vitamin_b7_mcg: { low: 7.5, high: 15 }, // 15%/30% of 50 µg NRV (biotin)
  vitamin_b8_mcg: { low: null, high: null },
  vitamin_b12_mcg: { low: 0.375, high: 0.75 }, // 15%/30% of 2.5 µg NRV
  calcium_mg: { low: 120, high: 240 }, // 15%/30% of 800 mg NRV
  iron_mg: { low: 2.1, high: 4.2 }, // 15%/30% of 14 mg NRV
  magnesium_mg: { low: 56.25, high: 112.5 }, // 15%/30% of 375 mg NRV
  phosphorus_mg: { low: 105, high: 210 }, // 15%/30% of 700 mg NRV
  potassium_mg: { low: 300, high: 600 }, // 15%/30% of 2000 mg NRV
  sodium_mg: { low: 120, high: 600 }, // FSA low/high salt (0.3g/1.5g) expressed as sodium via ×2.5
  zinc_mg: { low: 1.5, high: 3 }, // 15%/30% of 10 mg NRV
};

/**
 * `alta`/`normal`/`baja` only apply to `per_100g` foods — these thresholds
 * are all defined per 100 g, and a "per unit" food (e.g. "1 huevo") has no
 * known gram weight to normalize against, so classifying it against a
 * per-100g cut-off would be misleading. Order matters: it's the display
 * order, most to least informative.
 */
export type NutrientLevel = 'alta' | 'normal' | 'baja' | 'sin_clasificar' | 'nula' | 'desconocido';

export const NUTRIENT_LEVEL_ORDER: NutrientLevel[] = ['alta', 'normal', 'baja', 'sin_clasificar', 'nula', 'desconocido'];

export function classifyNutrientLevel(
  field: OptionalNutrientField,
  value: number | null,
  servingType: 'per_100g' | 'per_unit',
): NutrientLevel {
  if (value === null) return 'desconocido';
  if (value === 0) return 'nula';
  if (servingType !== 'per_100g') return 'sin_clasificar';

  const { low, high } = NUTRIENT_THRESHOLDS[field];
  if (high === null) return 'sin_clasificar';
  if (value >= high) return 'alta';
  if (low !== null && value < low) return 'baja';
  return 'normal';
}
