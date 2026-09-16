import type { OpenFoodFactsProduct } from '@/features/foods/api/openFoodFacts';
import type { FoodFormValues } from '@/features/foods/schema';

// Open Food Facts normalizes every nutriment value to grams, verified
// against real product responses and OFF's own published nutrient taxonomy
// (static.openfoodfacts.org/data/taxonomies/nutrients.json) rather than
// guessed — two real naming traps: niacin/B3 is keyed 'vitamin-pp' (not
// 'vitamin-b3'), and pantothenic acid/B5 is keyed 'pantothenic-acid' (not
// 'vitamin-b5'). OFF has no 'vitamin-b7'/'vitamin-b8' key at all — biotin
// is just 'biotin', mapped here to vitamin_b7_mcg (matching this app's
// USDA-side B7/biotin convention); vitamin_b8_mcg has no OFF equivalent,
// same posture it already has for USDA imports (always null).

const GRAM_FIELD_MAP: Partial<Record<string, keyof FoodFormValues>> = {
  proteins_100g: 'protein_g',
  carbohydrates_100g: 'carbs_g',
  fat_100g: 'fat_g',
  'saturated-fat_100g': 'saturated_fat_g',
  'monounsaturated-fat_100g': 'monounsaturated_fat_g',
  'polyunsaturated-fat_100g': 'polyunsaturated_fat_g',
  fiber_100g: 'fiber_g',
  sugars_100g: 'sugar_g',
  salt_100g: 'salt_g',
  'omega-3-fat_100g': 'omega3_g',
};

const MILLIGRAM_FIELD_MAP: Partial<Record<string, keyof FoodFormValues>> = {
  cholesterol_100g: 'cholesterol_mg',
  caffeine_100g: 'caffeine_mg',
  'vitamin-c_100g': 'vitamin_c_mg',
  'vitamin-b1_100g': 'vitamin_b1_mg',
  'vitamin-b2_100g': 'vitamin_b2_mg',
  'vitamin-pp_100g': 'vitamin_b3_mg',
  'pantothenic-acid_100g': 'vitamin_b5_mg',
  'vitamin-b6_100g': 'vitamin_b6_mg',
  calcium_100g: 'calcium_mg',
  iron_100g: 'iron_mg',
  magnesium_100g: 'magnesium_mg',
  phosphorus_100g: 'phosphorus_mg',
  potassium_100g: 'potassium_mg',
  sodium_100g: 'sodium_mg',
  zinc_100g: 'zinc_mg',
};

const MICROGRAM_FIELD_MAP: Partial<Record<string, keyof FoodFormValues>> = {
  'vitamin-a_100g': 'vitamin_a_mcg',
  'vitamin-d_100g': 'vitamin_d_mcg',
  'vitamin-e_100g': 'vitamin_e_mcg',
  'vitamin-k_100g': 'vitamin_k_mcg',
  biotin_100g: 'vitamin_b7_mcg',
  'vitamin-b12_100g': 'vitamin_b12_mcg',
  // vitamin_b8_mcg intentionally has no entry here.
};

const KCAL_PER_KJ = 1 / 4.184;

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function applyFieldMap(
  result: Partial<FoodFormValues>,
  nutriments: Partial<Record<string, number>>,
  fieldMap: Partial<Record<string, keyof FoodFormValues>>,
  multiplier: number,
) {
  for (const [offKey, field] of Object.entries(fieldMap)) {
    const value = nutriments[offKey];
    if (typeof value === 'number' && field) {
      (result as Record<string, number>)[field] = round(value * multiplier);
    }
  }
}

/**
 * Maps an Open Food Facts product to the subset of FoodFormValues it can
 * fill in. Never invents a value: only fields OFF actually reports end up
 * in the result, everything else is left for the user to fill in manually
 * on the (already fully editable) create-food form.
 */
export function mapOpenFoodFactsProduct(product: OpenFoodFactsProduct): Partial<FoodFormValues> {
  const result: Partial<FoodFormValues> = {};

  const name = product.product_name_es || product.product_name;
  if (name) result.name = name;

  if (product.nutrition_data_per && product.nutrition_data_per !== '100g') {
    // Per-serving or otherwise unreliable-as-per-100g data — only the name
    // (if any) is usable.
    return result;
  }

  const nutriments = product.nutriments ?? {};

  const kcal = nutriments['energy-kcal_100g'];
  const kj = nutriments['energy-kj_100g'];
  if (typeof kcal === 'number') result.energy_kcal = round(kcal);
  else if (typeof kj === 'number') result.energy_kcal = round(kj * KCAL_PER_KJ);

  if (product.nutrition_data_per === '100g') result.serving_type = 'per_100g';

  applyFieldMap(result, nutriments, GRAM_FIELD_MAP, 1);
  applyFieldMap(result, nutriments, MILLIGRAM_FIELD_MAP, 1000);
  applyFieldMap(result, nutriments, MICROGRAM_FIELD_MAP, 1_000_000);

  return result;
}
