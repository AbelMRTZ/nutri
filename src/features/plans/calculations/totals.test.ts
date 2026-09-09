import type { Tables } from '@/lib/supabase/database.types';

import { calculatePlanTotals } from './totals';

function makeFood(overrides: Partial<Tables<'foods'>>): Tables<'foods'> {
  return {
    id: 'food-1',
    user_id: 'user-1',
    name: 'Test food',
    serving_type: 'per_100g',
    category: 'other',
    energy_kcal: 200,
    fat_g: 10,
    protein_g: 20,
    carbs_g: 15,
    saturated_fat_g: null,
    monounsaturated_fat_g: null,
    polyunsaturated_fat_g: null,
    fiber_g: null,
    sugar_g: null,
    salt_g: null,
    omega3_g: null,
    cholesterol_mg: null,
    caffeine_mg: null,
    vitamin_c_mg: null,
    vitamin_a_mcg: null,
    vitamin_d_mcg: null,
    vitamin_e_mcg: null,
    vitamin_k_mcg: null,
    vitamin_b1_mg: null,
    vitamin_b2_mg: null,
    vitamin_b3_mg: null,
    vitamin_b5_mg: null,
    vitamin_b6_mg: null,
    vitamin_b7_mcg: null,
    vitamin_b8_mcg: null,
    vitamin_b12_mcg: null,
    calcium_mg: null,
    iron_mg: null,
    magnesium_mg: null,
    phosphorus_mg: null,
    potassium_mg: null,
    sodium_mg: null,
    zinc_mg: null,
    source_reference_food_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('calculatePlanTotals', () => {
  it('returns all zeros for an empty plan', () => {
    expect(calculatePlanTotals([])).toEqual({ energy_kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
  });

  it('matches calculateFoodContribution for a single entry', () => {
    const food = makeFood({ energy_kcal: 200, protein_g: 20, carbs_g: 15, fat_g: 10 });
    const result = calculatePlanTotals([{ food, quantity: 150 }]);

    expect(result).toEqual({ energy_kcal: 300, protein_g: 30, carbs_g: 22.5, fat_g: 15 });
  });

  it('sums multiple entries across different foods', () => {
    const oats = makeFood({ id: 'oats', serving_type: 'per_100g', energy_kcal: 380, protein_g: 13, carbs_g: 67, fat_g: 7 });
    const egg = makeFood({ id: 'egg', serving_type: 'per_unit', energy_kcal: 78, protein_g: 6, carbs_g: 0.6, fat_g: 5 });

    const result = calculatePlanTotals([
      { food: oats, quantity: 50 }, // half the 100g basis
      { food: egg, quantity: 2 },
    ]);

    expect(result.energy_kcal).toBeCloseTo(380 * 0.5 + 78 * 2, 1);
    expect(result.protein_g).toBeCloseTo(13 * 0.5 + 6 * 2, 2);
    expect(result.carbs_g).toBeCloseTo(67 * 0.5 + 0.6 * 2, 2);
    expect(result.fat_g).toBeCloseTo(7 * 0.5 + 5 * 2, 2);
  });

  it('keeps rounding stable (no NaN/Infinity) across many small additions', () => {
    const food = makeFood({ energy_kcal: 33.33, protein_g: 1.11, carbs_g: 2.22, fat_g: 0.33 });
    const entries = Array.from({ length: 10 }, () => ({ food, quantity: 10 }));

    const result = calculatePlanTotals(entries);

    // Each contribution is itself rounded to 1 decimal (3.3) before summing,
    // so the total is the sum of the rounded per-entry values, not the
    // unrounded ideal (33.33) — a small, expected drift from rounding once
    // per entry rather than once at the end.
    expect(Number.isFinite(result.energy_kcal)).toBe(true);
    expect(result.energy_kcal).toBeCloseTo(33, 1);
  });
});
