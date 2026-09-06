const PROTEIN_G_PER_KG = 1.8;
const FAT_CALORIE_SHARE = 0.25;

const CALORIES_PER_G_PROTEIN = 4;
const CALORIES_PER_G_CARBS = 4;
const CALORIES_PER_G_FAT = 9;

export type MacroTargets = {
  protein_g_target: number;
  carbs_g_target: number;
  fat_g_target: number;
};

/**
 * Default macro split: protein sized to bodyweight, fat as a share of total
 * calories, carbs fill the remainder. Intentionally a reasonable default, not
 * a final answer — the UI always lets the user override it.
 */
export function calculateDefaultMacros(caloriesTarget: number, weightKg: number): MacroTargets {
  const proteinG = PROTEIN_G_PER_KG * weightKg;
  const proteinCalories = proteinG * CALORIES_PER_G_PROTEIN;

  const fatCalories = caloriesTarget * FAT_CALORIE_SHARE;
  const fatG = fatCalories / CALORIES_PER_G_FAT;

  const remainingCalories = Math.max(caloriesTarget - proteinCalories - fatCalories, 0);
  const carbsG = remainingCalories / CALORIES_PER_G_CARBS;

  return {
    protein_g_target: Math.round(proteinG),
    carbs_g_target: Math.round(carbsG),
    fat_g_target: Math.round(fatG),
  };
}
