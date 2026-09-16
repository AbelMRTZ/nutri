export type DailyTargets = {
  calories_target: number | null;
  protein_g_target: number | null;
  carbs_g_target: number | null;
  fat_g_target: number | null;
};

const KCAL_PER_CARB_GRAM = 4;

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Las calorías quemadas por actividad física ese día se atribuyen
 * enteramente a carbohidratos (decisión explícita, no repartidas entre los
 * tres macros): suben el objetivo de calorías y, proporcionalmente (÷4
 * kcal/g), el de carbohidratos. Proteína y grasa no se tocan. Usado tanto
 * por el panel del Calendario (DailyTrackingSection) como por la edición de
 * una instancia de plan (PlanDetailScreen) para que nunca diverjan.
 */
export function applyCaloriesBurnedToTargets(baseTargets: DailyTargets, caloriesBurned: number): DailyTargets {
  if (!caloriesBurned) return baseTargets;

  return {
    ...baseTargets,
    calories_target:
      baseTargets.calories_target !== null ? round(baseTargets.calories_target + caloriesBurned, 0) : null,
    carbs_g_target:
      baseTargets.carbs_g_target !== null
        ? round(baseTargets.carbs_g_target + caloriesBurned / KCAL_PER_CARB_GRAM, 1)
        : null,
  };
}
