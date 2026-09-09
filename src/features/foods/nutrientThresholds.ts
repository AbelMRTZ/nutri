import type { OptionalNutrientField } from '@/features/foods/schema';

/**
 * Per-100g "high" cut-off for each optional nutrient, sourced from official
 * standards — never a guessed number:
 * - Vitamins/minerals: 30% of the EU Nutrient Reference Value (Regulation
 *   (EU) 1169/2011, Annex XIII) — the same "% VRN" already printed on any
 *   EU nutrition label, at the threshold the regulation itself uses for a
 *   "high in X" claim.
 * - Saturated fat / sugar / salt: the UK FSA traffic-light "high" cut-off
 *   (per 100g, solid foods).
 * - Fibre / omega-3 (ALA): the EU nutrition-claims "high in fibre" / "high
 *   in omega-3" thresholds (Regulation (EC) 1924/2006).
 * - Sodium: no NRV exists for sodium itself — derived from the FSA "high
 *   salt" cut-off (1.5 g/100g) via the official sodium→salt conversion
 *   (salt = sodium × 2.5), used here only to colour the bar, never stored
 *   or presented as a "salt" value.
 *
 * `null` means no official high/low standard exists for that nutrient
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
export const NUTRIENT_HIGH_THRESHOLD: Record<OptionalNutrientField, number | null> = {
  saturated_fat_g: 5, // FSA "high" saturated fat
  monounsaturated_fat_g: null,
  polyunsaturated_fat_g: null,
  fiber_g: 6, // EU "high in fibre"
  sugar_g: 22.5, // FSA "high" sugars
  salt_g: 1.5, // FSA "high" salt
  omega3_g: 0.6, // EU "high in omega-3" (ALA)
  cholesterol_mg: null,
  caffeine_mg: null,
  vitamin_c_mg: 24, // 30% of 80 mg NRV
  vitamin_a_mcg: 240, // 30% of 800 µg NRV
  vitamin_d_mcg: 1.5, // 30% of 5 µg NRV
  vitamin_e_mcg: 3.6, // 30% of 12 mg NRV (column stores mg, see note above)
  vitamin_k_mcg: 22.5, // 30% of 75 µg NRV
  vitamin_b1_mg: 0.33, // 30% of 1.1 mg NRV
  vitamin_b2_mg: 0.42, // 30% of 1.4 mg NRV
  vitamin_b3_mg: 4.8, // 30% of 16 mg NRV
  vitamin_b5_mg: 1.8, // 30% of 6 mg NRV
  vitamin_b6_mg: 0.42, // 30% of 1.4 mg NRV
  vitamin_b7_mcg: 15, // 30% of 50 µg NRV (biotin)
  vitamin_b8_mcg: null,
  vitamin_b12_mcg: 0.75, // 30% of 2.5 µg NRV
  calcium_mg: 240, // 30% of 800 mg NRV
  iron_mg: 4.2, // 30% of 14 mg NRV
  magnesium_mg: 112.5, // 30% of 375 mg NRV
  phosphorus_mg: 210, // 30% of 700 mg NRV
  potassium_mg: 600, // 30% of 2000 mg NRV
  sodium_mg: 600, // FSA "high" salt (1.5 g) expressed as sodium via ×2.5
  zinc_mg: 3, // 30% of 10 mg NRV
};

/**
 * `alta`/`baja` only apply to `per_100g` foods — these thresholds are all
 * defined per 100 g, and a "per unit" food (e.g. "1 huevo") has no known
 * gram weight to normalize against, so classifying it against a per-100g
 * cut-off would be misleading. Order matters: it's the display order,
 * most to least informative.
 */
export type NutrientLevel = 'alta' | 'baja' | 'sin_clasificar' | 'nula' | 'desconocido';

export const NUTRIENT_LEVEL_ORDER: NutrientLevel[] = ['alta', 'baja', 'sin_clasificar', 'nula', 'desconocido'];

export function classifyNutrientLevel(
  field: OptionalNutrientField,
  value: number | null,
  servingType: 'per_100g' | 'per_unit',
): NutrientLevel {
  if (value === null) return 'desconocido';
  if (value === 0) return 'nula';
  if (servingType !== 'per_100g') return 'sin_clasificar';

  const threshold = NUTRIENT_HIGH_THRESHOLD[field];
  if (threshold === null) return 'sin_clasificar';
  return value >= threshold ? 'alta' : 'baja';
}
