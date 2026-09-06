import { calculateBmr, calculateCaloriesTarget } from './tdee';

describe('calculateBmr', () => {
  it('applies the male offset (+5)', () => {
    expect(calculateBmr({ weight_kg: 80, height_cm: 180, age: 30, sex: 'male' })).toBeCloseTo(
      10 * 80 + 6.25 * 180 - 5 * 30 + 5,
    );
  });

  it('applies the female offset (-161)', () => {
    expect(calculateBmr({ weight_kg: 60, height_cm: 165, age: 28, sex: 'female' })).toBeCloseTo(
      10 * 60 + 6.25 * 165 - 5 * 28 - 161,
    );
  });
});

describe('calculateCaloriesTarget', () => {
  const base = { weight_kg: 80, height_cm: 180, age: 30, sex: 'male' as const };

  it('returns BMR * 1.2 for maintain, ignoring pace', () => {
    const bmr = calculateBmr(base);
    expect(calculateCaloriesTarget({ ...base, goal: 'maintain', pace_kg_per_week: undefined })).toBe(
      Math.round(bmr * 1.2),
    );
  });

  it('subtracts the pace-based daily deficit for "lose"', () => {
    const bmr = calculateBmr(base);
    const expected = Math.round(bmr * 1.2 - (0.5 * 7700) / 7);
    expect(calculateCaloriesTarget({ ...base, goal: 'lose', pace_kg_per_week: 0.5 })).toBe(expected);
  });

  it('adds the pace-based daily surplus for "gain"', () => {
    const bmr = calculateBmr(base);
    const expected = Math.round(bmr * 1.2 + (0.3 * 7700) / 7);
    expect(calculateCaloriesTarget({ ...base, goal: 'gain', pace_kg_per_week: 0.3 })).toBe(expected);
  });

  it('falls back to the base calories if pace is missing for a non-maintain goal', () => {
    const bmr = calculateBmr(base);
    expect(calculateCaloriesTarget({ ...base, goal: 'lose', pace_kg_per_week: undefined })).toBe(
      Math.round(bmr * 1.2),
    );
  });
});
