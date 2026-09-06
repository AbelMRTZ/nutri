import { optionalNutrientFields, type OptionalNutrientField } from '@/features/foods/schema';
import type { Tables } from '@/lib/supabase/database.types';

export type FoodContribution = {
  energy_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
} & Record<OptionalNutrientField, number | null>;

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Scales a food's stored nutrient values to a given quantity. For a
 * `per_100g` food, quantity is grams and the factor is quantity/100; for a
 * `per_unit` food, quantity is a unit count and the factor is quantity
 * itself. Optional nutrients the food doesn't have stay `null`.
 */
export function calculateFoodContribution(food: Tables<'foods'>, quantity: number): FoodContribution {
  const factor = food.serving_type === 'per_100g' ? quantity / 100 : quantity;

  const optional = Object.fromEntries(
    optionalNutrientFields.map((field) => {
      const raw = food[field];
      return [field, raw === null ? null : round(raw * factor, 2)];
    }),
  ) as Record<OptionalNutrientField, number | null>;

  return {
    energy_kcal: round(food.energy_kcal * factor, 1),
    protein_g: round(food.protein_g * factor, 2),
    carbs_g: round(food.carbs_g * factor, 2),
    fat_g: round(food.fat_g * factor, 2),
    ...optional,
  };
}
