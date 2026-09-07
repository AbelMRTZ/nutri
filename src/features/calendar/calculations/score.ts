export type DailyScoreTotals = {
  energy_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type DailyScoreTargets = {
  calories_target: number | null;
  protein_g_target: number | null;
  carbs_g_target: number | null;
  fat_g_target: number | null;
};

const WEIGHTS = { calories: 0.4, protein: 0.2, carbs: 0.2, fat: 0.2 };

/** 100 minus the % deviation from target, clamped to [0, 100]. */
function metricScore(consumed: number, target: number): number {
  const deviationPct = (Math.abs(consumed - target) / target) * 100;
  return Math.max(0, 100 - deviationPct);
}

/**
 * 0-100 score for how closely a day's consumed totals track its targets,
 * weighted toward calories (40%) over the three macros (20% each) —
 * calories reflect overall quantity, macros reflect composition. Returns
 * null when there's nothing to compare against (no plan assigned, or a
 * standard plan whose profile targets aren't set yet), so callers can show
 * "sin objetivo" instead of a misleading 0.
 */
export function calculateDailyScore(totals: DailyScoreTotals, targets: DailyScoreTargets): number | null {
  const { calories_target, protein_g_target, carbs_g_target, fat_g_target } = targets;
  if (!calories_target || !protein_g_target || !carbs_g_target || !fat_g_target) return null;

  const score =
    metricScore(totals.energy_kcal, calories_target) * WEIGHTS.calories +
    metricScore(totals.protein_g, protein_g_target) * WEIGHTS.protein +
    metricScore(totals.carbs_g, carbs_g_target) * WEIGHTS.carbs +
    metricScore(totals.fat_g, fat_g_target) * WEIGHTS.fat;

  return Math.round(score);
}
