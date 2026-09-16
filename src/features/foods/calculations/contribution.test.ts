import type { Tables } from '@/lib/supabase/database.types';

import { calculateFoodContribution } from './contribution';

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

describe('calculateFoodContribution', () => {
  it('scales a per_100g food by quantity/100', () => {
    const food = makeFood({ serving_type: 'per_100g', energy_kcal: 200, protein_g: 20, carbs_g: 15, fat_g: 10 });
    const result = calculateFoodContribution(food, 150);

    expect(result.energy_kcal).toBe(300);
    expect(result.protein_g).toBe(30);
    expect(result.carbs_g).toBe(22.5);
    expect(result.fat_g).toBe(15);
  });

  it('scales a per_unit food by the unit count directly', () => {
    const food = makeFood({ serving_type: 'per_unit', energy_kcal: 80, protein_g: 1, carbs_g: 20, fat_g: 0.3 });
    const result = calculateFoodContribution(food, 3);

    expect(result.energy_kcal).toBe(240);
    expect(result.protein_g).toBe(3);
    expect(result.carbs_g).toBe(60);
    expect(result.fat_g).toBe(0.9);
  });

  it('leaves undefined optional nutrients as null', () => {
    const food = makeFood({});
    const result = calculateFoodContribution(food, 100);

    expect(result.iron_mg).toBeNull();
    expect(result.vitamin_c_mg).toBeNull();
  });

  it('scales a defined optional nutrient proportionally', () => {
    const food = makeFood({ serving_type: 'per_100g', iron_mg: 2 });
    const result = calculateFoodContribution(food, 50);

    expect(result.iron_mg).toBe(1);
  });
});
