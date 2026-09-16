import { applyCaloriesBurnedToTargets, type DailyTargets } from './targets';

const baseTargets: DailyTargets = {
  calories_target: 2000,
  protein_g_target: 150,
  carbs_g_target: 190,
  fat_g_target: 60,
};

describe('applyCaloriesBurnedToTargets', () => {
  it('adds burned calories to calories_target and their carb equivalent (÷4) to carbs_g_target', () => {
    const result = applyCaloriesBurnedToTargets(baseTargets, 400);

    expect(result.calories_target).toBe(2400);
    expect(result.carbs_g_target).toBe(290); // 190 + 400/4
    expect(result.protein_g_target).toBe(150);
    expect(result.fat_g_target).toBe(60);
  });

  it('returns the base targets unchanged when nothing was burned', () => {
    const result = applyCaloriesBurnedToTargets(baseTargets, 0);
    expect(result).toEqual(baseTargets);
  });

  it('rounds calories to a whole number and carbs to 1 decimal', () => {
    const result = applyCaloriesBurnedToTargets(baseTargets, 240.5);

    expect(result.calories_target).toBe(2241); // 2000 + 240.5, rounded
    expect(result.carbs_g_target).toBe(60.1 + 190); // 190 + 240.5/4 = 190 + 60.125 -> 250.1
  });

  it('leaves calories_target null when the base target has no calories set', () => {
    const result = applyCaloriesBurnedToTargets({ ...baseTargets, calories_target: null }, 400);
    expect(result.calories_target).toBeNull();
  });

  it('leaves carbs_g_target null when the base target has no carbs set', () => {
    const result = applyCaloriesBurnedToTargets({ ...baseTargets, carbs_g_target: null }, 400);
    expect(result.carbs_g_target).toBeNull();
  });

  it('never touches protein or fat targets', () => {
    const result = applyCaloriesBurnedToTargets(baseTargets, 1000);
    expect(result.protein_g_target).toBe(baseTargets.protein_g_target);
    expect(result.fat_g_target).toBe(baseTargets.fat_g_target);
  });
});
