import { generateScheduleDates } from './schedule';

describe('generateScheduleDates', () => {
  // 2024-01-01 is a Monday (getDay() === 1).
  const monday = new Date(2024, 0, 1);

  it('returns only dates matching the selected weekdays within the window', () => {
    // Mon(1) and Wed(3) over a 7-day window starting Monday (Jan 1-7) -> Jan 1 and Jan 3 only;
    // the next Monday (Jan 8) falls outside the 7-day window.
    const result = generateScheduleDates(monday, 7, new Set([1, 3]));
    expect(result.map((d) => d.getDate())).toEqual([1, 3]);
  });

  it('includes the next matching weekday once the window is wide enough', () => {
    const result = generateScheduleDates(monday, 8, new Set([1, 3]));
    expect(result.map((d) => d.getDate())).toEqual([1, 3, 8]);
  });

  it('returns every date in the window when all weekdays are selected', () => {
    const result = generateScheduleDates(monday, 5, new Set([0, 1, 2, 3, 4, 5, 6]));
    expect(result).toHaveLength(5);
    expect(result.map((d) => d.getDate())).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns an empty array when no weekdays are selected', () => {
    expect(generateScheduleDates(monday, 30, new Set())).toEqual([]);
  });

  it('never returns more dates than the window size', () => {
    const result = generateScheduleDates(monday, 3, new Set([0, 1, 2, 3, 4, 5, 6]));
    expect(result).toHaveLength(3);
  });

  it('returns an empty array for a zero or negative day count', () => {
    expect(generateScheduleDates(monday, 0, new Set([1]))).toEqual([]);
    expect(generateScheduleDates(monday, -5, new Set([1]))).toEqual([]);
  });
});
