// Imported from its concrete module, not the `foods` barrel: the barrel also
// re-exports UI screens whose dependency chain pulls in native modules that
// don't run in the plain jest-expo test environment this pure calculation is
// tested under.
import { calculateFoodContribution, type FoodContribution } from '@/features/foods/calculations/contribution';
import type { Tables } from '@/lib/supabase/database.types';

export type SubstitutionSuggestion = {
  food: Tables<'foods'>;
  /** Quantity of the candidate needed to match the target's calories, rounded to a usable value for its serving_type. */
  quantity: number;
  contribution: FoodContribution;
  /** 0-100: how closely the candidate's macros match the target's at that matching quantity. */
  similarity: number;
};

function roundQuantity(quantity: number, servingType: Tables<'foods'>['serving_type']): number {
  return servingType === 'per_unit' ? Math.round(quantity) : Math.round(quantity * 10) / 10;
}

function metricSimilarity(target: number, candidate: number): number {
  if (target === 0 && candidate === 0) return 100;
  const base = Math.max(target, candidate);
  const deviationPct = (Math.abs(target - candidate) / base) * 100;
  return Math.max(0, 100 - deviationPct);
}

/** Average closeness of protein/carbs/fat once both foods are scaled to the same calories. */
function calculateMacroSimilarity(target: FoodContribution, candidate: FoodContribution): number {
  const proteinScore = metricSimilarity(target.protein_g, candidate.protein_g);
  const carbsScore = metricSimilarity(target.carbs_g, candidate.carbs_g);
  const fatScore = metricSimilarity(target.fat_g, candidate.fat_g);
  return Math.round((proteinScore + carbsScore + fatScore) / 3);
}

/**
 * Ranks candidate foods as replacements for `target` (the current food's
 * contribution at its current quantity): for each candidate, finds the
 * quantity that reproduces the same calories, then scores how close its
 * macro composition is at that quantity — so "swap chicken for turkey"
 * ranks above "swap chicken for olive oil" even though both can be dosed
 * to match the calories exactly. Candidates whose calories-per-serving is
 * zero or negative (can't be scaled to match any positive calorie target)
 * are skipped entirely rather than suggested at an absurd quantity.
 */
export function suggestSubstitutes(
  target: FoodContribution,
  candidates: Tables<'foods'>[],
): SubstitutionSuggestion[] {
  return candidates
    .map((food): SubstitutionSuggestion | null => {
      const caloriesPerServingUnit = food.serving_type === 'per_unit' ? food.energy_kcal : food.energy_kcal / 100;
      if (caloriesPerServingUnit <= 0) return null;

      const quantity = roundQuantity(target.energy_kcal / caloriesPerServingUnit, food.serving_type);
      if (quantity <= 0) return null;

      const contribution = calculateFoodContribution(food, quantity);
      return { food, quantity, contribution, similarity: calculateMacroSimilarity(target, contribution) };
    })
    .filter((suggestion): suggestion is SubstitutionSuggestion => suggestion !== null)
    .sort((a, b) => b.similarity - a.similarity);
}
