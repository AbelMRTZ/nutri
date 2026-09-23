import { filterLogsByRange } from './range';

describe('filterLogsByRange', () => {
  // 2024-01-31, so "week"/"month" cutoffs land on clean dates to assert against.
  const today = new Date(2024, 0, 31);

  const logs = [
    { date: '2023-06-15' },
    { date: '2023-08-01' },
    { date: '2024-01-01' },
    { date: '2024-01-24' },
    { date: '2024-01-25' },
    { date: '2024-01-31' },
  ];

  it('keeps only the last 7 days (inclusive of today) for "week"', () => {
    // cutoff = today - 6 days = 2024-01-25
    expect(filterLogsByRange(logs, 'week', today).map((l) => l.date)).toEqual(['2024-01-25', '2024-01-31']);
  });

  it('keeps only the last 30 days (inclusive of today) for "month"', () => {
    // cutoff = today - 29 days = 2024-01-02
    expect(filterLogsByRange(logs, 'month', today).map((l) => l.date)).toEqual([
      '2024-01-24',
      '2024-01-25',
      '2024-01-31',
    ]);
  });

  it('keeps 182 days back for "six_months"', () => {
    // cutoff = today - 181 days = 2023-08-02, so the 2023-08-01 entry falls just outside
    expect(filterLogsByRange(logs, 'six_months', today).map((l) => l.date)).toEqual([
      '2024-01-01',
      '2024-01-24',
      '2024-01-25',
      '2024-01-31',
    ]);
  });

  it('returns every log unfiltered for "lifetime"', () => {
    expect(filterLogsByRange(logs, 'lifetime', today)).toEqual(logs);
  });

  it('returns an empty array when there are no logs', () => {
    expect(filterLogsByRange([], 'lifetime', today)).toEqual([]);
    expect(filterLogsByRange([], 'week', today)).toEqual([]);
  });
});
