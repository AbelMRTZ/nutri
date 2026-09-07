import { calculateDailyScore } from './score';

const TARGETS = { calories_target: 2000, protein_g_target: 150, carbs_g_target: 200, fat_g_target: 70 };

describe('calculateDailyScore', () => {
  it('returns 100 when consumed totals exactly match targets', () => {
    expect(calculateDailyScore({ energy_kcal: 2000, protein_g: 150, carbs_g: 200, fat_g: 70 }, TARGETS)).toBe(100);
  });

  it('returns 0 when nothing has been consumed yet', () => {
    expect(calculateDailyScore({ energy_kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }, TARGETS)).toBe(0);
  });

  it('clamps at 0 instead of going negative when consumption overshoots wildly', () => {
    expect(calculateDailyScore({ energy_kcal: 6000, protein_g: 450, carbs_g: 600, fat_g: 210 }, TARGETS)).toBe(0);
  });

  it('weights calories at 40% and each macro at 20%', () => {
    // Calories exactly on target; every macro off by 50% -> each metric score is 50.
    const score = calculateDailyScore(
      { energy_kcal: 2000, protein_g: 75, carbs_g: 100, fat_g: 35 },
      TARGETS,
    );
    // 100*0.4 + 50*0.2 + 50*0.2 + 50*0.2 = 40 + 30 = 70
    expect(score).toBe(70);
  });

  it('returns null when any target is missing (nothing to compare against)', () => {
    expect(
      calculateDailyScore(
        { energy_kcal: 500, protein_g: 30, carbs_g: 50, fat_g: 15 },
        { calories_target: null, protein_g_target: 150, carbs_g_target: 200, fat_g_target: 70 },
      ),
    ).toBeNull();
  });

  it('returns null when there are no targets at all', () => {
    expect(
      calculateDailyScore(
        { energy_kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
        { calories_target: null, protein_g_target: null, carbs_g_target: null, fat_g_target: null },
      ),
    ).toBeNull();
  });
});
