import type { Tables } from '@/lib/supabase/database.types';

import { calculateFoodContribution } from './contribution';
import { suggestSubstitutes } from './substitution';

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
    source_barcode: null,
    source_reference_food_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('suggestSubstitutes', () => {
  // Chicken breast eaten at 150g: 300 kcal, 45g protein, 0g carbs, 15g fat.
  const chicken = makeFood({ id: 'chicken', name: 'Chicken', energy_kcal: 200, protein_g: 30, carbs_g: 0, fat_g: 10 });
  const target = calculateFoodContribution(chicken, 150);

  it('finds a quantity of the candidate that matches the target calories', () => {
    const turkey = makeFood({ id: 'turkey', name: 'Turkey', energy_kcal: 150, protein_g: 29, carbs_g: 0, fat_g: 3 });
    const [suggestion] = suggestSubstitutes(target, [turkey]);

    expect(suggestion.contribution.energy_kcal).toBeCloseTo(target.energy_kcal, 0);
  });

  it('ranks a macro-similar candidate above a macro-dissimilar one at matching calories', () => {
    const turkey = makeFood({ id: 'turkey', name: 'Turkey', energy_kcal: 150, protein_g: 29, carbs_g: 0, fat_g: 3 });
    const oliveOil = makeFood({ id: 'olive-oil', name: 'Olive oil', energy_kcal: 884, protein_g: 0, carbs_g: 0, fat_g: 100 });

    const results = suggestSubstitutes(target, [oliveOil, turkey]);

    expect(results.map((r) => r.food.id)).toEqual(['turkey', 'olive-oil']);
    expect(results[0].similarity).toBeGreaterThan(results[1].similarity);
  });

  it('gives a near-identical food a similarity close to 100', () => {
    const almostChicken = makeFood({ id: 'chicken-2', name: 'Chicken again', energy_kcal: 200, protein_g: 30, carbs_g: 0, fat_g: 10 });
    const [suggestion] = suggestSubstitutes(target, [almostChicken]);

    expect(suggestion.similarity).toBe(100);
  });

  it('rounds a per_unit candidate quantity to a whole number', () => {
    const egg = makeFood({ id: 'egg', name: 'Egg', serving_type: 'per_unit', energy_kcal: 78, protein_g: 6, carbs_g: 0.6, fat_g: 5 });
    const [suggestion] = suggestSubstitutes(target, [egg]);

    expect(Number.isInteger(suggestion.quantity)).toBe(true);
  });

  it('rounds a per_100g candidate quantity to one decimal', () => {
    const tofu = makeFood({ id: 'tofu', name: 'Tofu', energy_kcal: 76, protein_g: 8, carbs_g: 1.9, fat_g: 4.8 });
    const [suggestion] = suggestSubstitutes(target, [tofu]);

    expect(suggestion.quantity).toBe(Math.round(suggestion.quantity * 10) / 10);
  });

  it('skips candidates with zero or negative calories per serving', () => {
    const water = makeFood({ id: 'water', name: 'Water', energy_kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
    const results = suggestSubstitutes(target, [water]);

    expect(results).toEqual([]);
  });

  it('returns an empty list for an empty candidate pool', () => {
    expect(suggestSubstitutes(target, [])).toEqual([]);
  });
});
