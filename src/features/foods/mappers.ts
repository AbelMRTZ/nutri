import type { Tables } from '@/lib/supabase/database.types';

import type { FoodFormValues } from './schema';

/** Supabase returns `null` for empty columns; RHF/NumericField expect `undefined`. */
export function toFormDefaults(row: Tables<'foods'> | undefined): Partial<FoodFormValues> {
  if (!row) return {};

  return {
    name: row.name,
    serving_type: row.serving_type,
    category: row.category,
    energy_kcal: row.energy_kcal,
    fat_g: row.fat_g,
    protein_g: row.protein_g,
    carbs_g: row.carbs_g,
    saturated_fat_g: row.saturated_fat_g ?? undefined,
    monounsaturated_fat_g: row.monounsaturated_fat_g ?? undefined,
    polyunsaturated_fat_g: row.polyunsaturated_fat_g ?? undefined,
    fiber_g: row.fiber_g ?? undefined,
    sugar_g: row.sugar_g ?? undefined,
    salt_g: row.salt_g ?? undefined,
    omega3_g: row.omega3_g ?? undefined,
    cholesterol_mg: row.cholesterol_mg ?? undefined,
    caffeine_mg: row.caffeine_mg ?? undefined,
    vitamin_c_mg: row.vitamin_c_mg ?? undefined,
    vitamin_a_mcg: row.vitamin_a_mcg ?? undefined,
    vitamin_d_mcg: row.vitamin_d_mcg ?? undefined,
    vitamin_e_mcg: row.vitamin_e_mcg ?? undefined,
    vitamin_k_mcg: row.vitamin_k_mcg ?? undefined,
    vitamin_b1_mg: row.vitamin_b1_mg ?? undefined,
    vitamin_b2_mg: row.vitamin_b2_mg ?? undefined,
    vitamin_b3_mg: row.vitamin_b3_mg ?? undefined,
    vitamin_b5_mg: row.vitamin_b5_mg ?? undefined,
    vitamin_b6_mg: row.vitamin_b6_mg ?? undefined,
    vitamin_b7_mcg: row.vitamin_b7_mcg ?? undefined,
    vitamin_b8_mcg: row.vitamin_b8_mcg ?? undefined,
    vitamin_b12_mcg: row.vitamin_b12_mcg ?? undefined,
    calcium_mg: row.calcium_mg ?? undefined,
    iron_mg: row.iron_mg ?? undefined,
    magnesium_mg: row.magnesium_mg ?? undefined,
    phosphorus_mg: row.phosphorus_mg ?? undefined,
    potassium_mg: row.potassium_mg ?? undefined,
    sodium_mg: row.sodium_mg ?? undefined,
    zinc_mg: row.zinc_mg ?? undefined,
  };
}
