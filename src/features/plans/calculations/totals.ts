// Imported from its concrete module, not the `foods` barrel: the barrel also
// re-exports UI screens whose dependency chain pulls in native modules
// (AsyncStorage, etc.) that don't run in the plain jest-expo test environment
// this pure calculation is tested under.
import { calculateFoodContribution } from '@/features/foods/calculations/contribution';
import type { Tables } from '@/lib/supabase/database.types';

export type PlanFoodEntry = {
  food: Tables<'foods'>;
  quantity: number;
};

export type PlanTotals = {
  energy_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

const ZERO_TOTALS: PlanTotals = { energy_kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };

/** Sums calculateFoodContribution across every food currently in a plan. */
export function calculatePlanTotals(entries: PlanFoodEntry[]): PlanTotals {
  return entries.reduce((totals, { food, quantity }) => {
    const contribution = calculateFoodContribution(food, quantity);
    return {
      energy_kcal: round(totals.energy_kcal + contribution.energy_kcal, 1),
      protein_g: round(totals.protein_g + contribution.protein_g, 2),
      carbs_g: round(totals.carbs_g + contribution.carbs_g, 2),
      fat_g: round(totals.fat_g + contribution.fat_g, 2),
    };
  }, ZERO_TOTALS);
}
