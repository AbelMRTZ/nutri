import type { ProfileFormValues } from '@/features/profile/schema';

/**
 * Fixed NEAT (non-exercise activity) multiplier applied to BMR.
 *
 * There is deliberately no user-facing "activity level" field: the user's
 * real activity is captured later, day by day, through logged workouts
 * (Entrenamiento phase), which add their own kcal on top of this baseline in
 * the Calendario. Baking a self-reported activity level into this baseline
 * would double-count that effort.
 */
const NEAT_MULTIPLIER = 1.2;

/** ~7700 kcal correspond to 1 kg of body mass. */
const KCAL_PER_KG = 7700;

export function calculateBmr(details: Pick<ProfileFormValues, 'weight_kg' | 'height_cm' | 'age' | 'sex'>): number {
  const { weight_kg, height_cm, age, sex } = details;
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function calculateBaseCalories(details: Pick<ProfileFormValues, 'weight_kg' | 'height_cm' | 'age' | 'sex'>): number {
  return calculateBmr(details) * NEAT_MULTIPLIER;
}

export function calculateCaloriesTarget(
  details: Pick<ProfileFormValues, 'weight_kg' | 'height_cm' | 'age' | 'sex' | 'goal' | 'pace_kg_per_week'>,
): number {
  const baseCalories = calculateBaseCalories(details);

  if (details.goal === 'maintain' || !details.pace_kg_per_week) {
    return Math.round(baseCalories);
  }

  const dailyAdjustment = (details.pace_kg_per_week * KCAL_PER_KG) / 7;
  const target = details.goal === 'lose' ? baseCalories - dailyAdjustment : baseCalories + dailyAdjustment;

  return Math.round(target);
}
