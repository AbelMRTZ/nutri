import type { PlanItemWithDetails } from '@/features/plans/api/planItems';
import { toDateKey } from '@/lib/dates';
import type { Tables } from '@/lib/supabase/database.types';

import { buildCalendarExportRows, buildShoppingListRows, countDaysInclusive } from './buildExportRows';

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

function makeCalendarDay(overrides: Partial<Tables<'calendar_days'>>): Tables<'calendar_days'> {
  return {
    id: 'day-1',
    user_id: 'user-1',
    date: '2026-09-17',
    is_free: false,
    plan_id: null,
    plan_schedule_id: null,
    created_at: '2026-09-17T00:00:00Z',
    updated_at: '2026-09-17T00:00:00Z',
    ...overrides,
  };
}

function makePlanItem(overrides: Partial<PlanItemWithDetails>): PlanItemWithDetails {
  return {
    id: 'item-1',
    plan_id: 'plan-1',
    meal_id: 'meal-1',
    sort_order: 0,
    created_at: '2026-09-17T00:00:00Z',
    updated_at: '2026-09-17T00:00:00Z',
    meal: {
      id: 'meal-1',
      user_id: 'user-1',
      name: 'Desayuno de prueba',
      category: 'breakfast',
      recipe_url: null,
      created_at: '2026-09-17T00:00:00Z',
      updated_at: '2026-09-17T00:00:00Z',
    },
    plan_item_foods: [],
    ...overrides,
  };
}

describe('buildCalendarExportRows', () => {
  it('marks a day with no calendar_days row as unplanned', () => {
    const rows = buildCalendarExportRows('2026-09-17', '2026-09-17', new Map(), new Map());

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ meal: 'Sin planificar', food: null, kcal: null });
    expect(toDateKey(rows[0].date)).toBe('2026-09-17');
  });

  it('marks a free day', () => {
    const days = new Map([['2026-09-17', makeCalendarDay({ is_free: true })]]);
    const rows = buildCalendarExportRows('2026-09-17', '2026-09-17', days, new Map());

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ meal: 'Día libre', food: null });
  });

  it('marks a day with a plan_id but no fetched plan items as having no meals assigned', () => {
    const days = new Map([['2026-09-17', makeCalendarDay({ plan_id: 'plan-1' })]]);
    const rows = buildCalendarExportRows('2026-09-17', '2026-09-17', days, new Map());

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ meal: 'Plan sin comidas asignadas' });
  });

  it('emits one row per meal when a plan item has no foods yet', () => {
    const days = new Map([['2026-09-17', makeCalendarDay({ plan_id: 'plan-1' })]]);
    const planItems = new Map([['plan-1', [makePlanItem({})]]]);
    const rows = buildCalendarExportRows('2026-09-17', '2026-09-17', days, planItems);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ meal: 'Desayuno de prueba', category: 'Desayuno', food: null, kcal: null });
  });

  it('emits one row per food, with the correct scaled contribution', () => {
    const oats = makeFood({ id: 'oats', name: 'Avena', serving_type: 'per_100g', energy_kcal: 380, protein_g: 13, carbs_g: 67, fat_g: 7 });
    const egg = makeFood({ id: 'egg', name: 'Huevo', serving_type: 'per_unit', energy_kcal: 78, protein_g: 6, carbs_g: 0.6, fat_g: 5 });

    const days = new Map([['2026-09-17', makeCalendarDay({ plan_id: 'plan-1' })]]);
    const planItems = new Map([
      [
        'plan-1',
        [
          makePlanItem({
            plan_item_foods: [
              { id: 'pif-1', plan_item_id: 'item-1', food_id: 'oats', quantity: 50, is_variable: false, created_at: '', updated_at: '', food: oats },
              { id: 'pif-2', plan_item_id: 'item-1', food_id: 'egg', quantity: 2, is_variable: false, created_at: '', updated_at: '', food: egg },
            ],
          }),
        ],
      ],
    ]);

    const rows = buildCalendarExportRows('2026-09-17', '2026-09-17', days, planItems);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      meal: 'Desayuno de prueba',
      category: 'Desayuno',
      foodId: 'oats',
      food: 'Avena',
      foodCategory: 'Otros',
      quantity: 50,
      unit: 'g',
    });
    expect(rows[0].kcal).toBeCloseTo(190, 1);
    expect(rows[1]).toMatchObject({ foodId: 'egg', food: 'Huevo', quantity: 2, unit: 'unidades' });
    expect(rows[1].kcal).toBeCloseTo(156, 1);
  });

  it('walks the full inclusive date range, one row set per day minimum', () => {
    const days = new Map([['2026-09-18', makeCalendarDay({ date: '2026-09-18', is_free: true })]]);
    const rows = buildCalendarExportRows('2026-09-17', '2026-09-19', days, new Map());

    expect(rows.map((row) => toDateKey(row.date))).toEqual(['2026-09-17', '2026-09-18', '2026-09-19']);
    expect(rows[0].meal).toBe('Sin planificar');
    expect(rows[1].meal).toBe('Día libre');
    expect(rows[2].meal).toBe('Sin planificar');
  });
});

describe('buildShoppingListRows', () => {
  it('ignores rows with no food (unplanned/free/no-food-meal days)', () => {
    const rows = buildCalendarExportRows('2026-09-17', '2026-09-17', new Map(), new Map());
    expect(buildShoppingListRows(rows)).toEqual([]);
  });

  it('sums the same food across several days into one line', () => {
    const oats = makeFood({ id: 'oats', name: 'Avena', category: 'grains_pasta', serving_type: 'per_100g' });
    const days = new Map([
      ['2026-09-17', makeCalendarDay({ date: '2026-09-17', plan_id: 'plan-1' })],
      ['2026-09-18', makeCalendarDay({ id: 'day-2', date: '2026-09-18', plan_id: 'plan-1' })],
    ]);
    const planItems = new Map([
      [
        'plan-1',
        [
          makePlanItem({
            plan_item_foods: [
              { id: 'pif-1', plan_item_id: 'item-1', food_id: 'oats', quantity: 50, is_variable: false, created_at: '', updated_at: '', food: oats },
            ],
          }),
        ],
      ],
    ]);

    const rows = buildCalendarExportRows('2026-09-17', '2026-09-18', days, planItems);
    const shoppingList = buildShoppingListRows(rows);

    expect(shoppingList).toEqual([{ food: 'Avena', foodCategory: 'Cereales y Pastas', quantity: 100, unit: 'g' }]);
  });

  it('keeps two different foods that share a name as separate lines, never merged by name', () => {
    const brandA = makeFood({ id: 'food-a', name: 'Leche', category: 'dairy', serving_type: 'per_100g', energy_kcal: 60 });
    const brandB = makeFood({ id: 'food-b', name: 'Leche', category: 'dairy', serving_type: 'per_100g', energy_kcal: 45 });
    const days = new Map([['2026-09-17', makeCalendarDay({ plan_id: 'plan-1' })]]);
    const planItems = new Map([
      [
        'plan-1',
        [
          makePlanItem({
            plan_item_foods: [
              { id: 'pif-1', plan_item_id: 'item-1', food_id: 'food-a', quantity: 200, is_variable: false, created_at: '', updated_at: '', food: brandA },
              { id: 'pif-2', plan_item_id: 'item-1', food_id: 'food-b', quantity: 300, is_variable: false, created_at: '', updated_at: '', food: brandB },
            ],
          }),
        ],
      ],
    ]);

    const shoppingList = buildShoppingListRows(buildCalendarExportRows('2026-09-17', '2026-09-17', days, planItems));

    expect(shoppingList).toHaveLength(2);
    expect(shoppingList.reduce((sum, row) => sum + row.quantity, 0)).toBe(500);
  });

  it('sorts by food category, then by food name, both in Spanish alphabetical order', () => {
    const kale = makeFood({ id: 'kale', name: 'Kale', category: 'vegetable' });
    const apple = makeFood({ id: 'apple', name: 'Manzana', category: 'fruit' });
    const carrot = makeFood({ id: 'carrot', name: 'Acelga', category: 'vegetable' });
    const days = new Map([['2026-09-17', makeCalendarDay({ plan_id: 'plan-1' })]]);
    const planItems = new Map([
      [
        'plan-1',
        [
          makePlanItem({
            plan_item_foods: [
              { id: 'pif-1', plan_item_id: 'item-1', food_id: 'kale', quantity: 100, is_variable: false, created_at: '', updated_at: '', food: kale },
              { id: 'pif-2', plan_item_id: 'item-1', food_id: 'apple', quantity: 100, is_variable: false, created_at: '', updated_at: '', food: apple },
              { id: 'pif-3', plan_item_id: 'item-1', food_id: 'carrot', quantity: 100, is_variable: false, created_at: '', updated_at: '', food: carrot },
            ],
          }),
        ],
      ],
    ]);

    const shoppingList = buildShoppingListRows(buildCalendarExportRows('2026-09-17', '2026-09-17', days, planItems));

    expect(shoppingList.map((row) => row.food)).toEqual(['Manzana', 'Acelga', 'Kale']);
  });
});

describe('countDaysInclusive', () => {
  it('counts a single day as 1', () => {
    expect(countDaysInclusive('2026-09-17', '2026-09-17')).toBe(1);
  });

  it('counts a week as 7', () => {
    expect(countDaysInclusive('2026-09-17', '2026-09-23')).toBe(7);
  });

  it('returns a non-positive number when endDate is before startDate', () => {
    expect(countDaysInclusive('2026-09-17', '2026-09-16')).toBe(0);
    expect(countDaysInclusive('2026-09-17', '2026-09-10')).toBeLessThan(0);
  });
});
