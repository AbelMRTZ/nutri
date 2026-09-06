import { calculateDefaultMacros } from './macros';

describe('calculateDefaultMacros', () => {
  it('sizes protein to bodyweight at 1.8 g/kg', () => {
    const result = calculateDefaultMacros(2500, 80);
    expect(result.protein_g_target).toBe(Math.round(1.8 * 80));
  });

  it('sizes fat to 25% of total calories', () => {
    const result = calculateDefaultMacros(2000, 70);
    expect(result.fat_g_target).toBe(Math.round((2000 * 0.25) / 9));
  });

  it('fills the remainder with carbs so macro calories roughly match the target', () => {
    const caloriesTarget = 2400;
    const result = calculateDefaultMacros(caloriesTarget, 75);
    const macroCalories = result.protein_g_target * 4 + result.carbs_g_target * 4 + result.fat_g_target * 9;
    expect(macroCalories).toBeGreaterThan(caloriesTarget - 20);
    expect(macroCalories).toBeLessThan(caloriesTarget + 20);
  });

  it('never returns negative carbs when protein+fat calories exceed the target', () => {
    const result = calculateDefaultMacros(1200, 150);
    expect(result.carbs_g_target).toBeGreaterThanOrEqual(0);
  });
});
