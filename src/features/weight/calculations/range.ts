import { addDays, toDateKey } from '@/lib/dates';

export const weightChartRangeOptions = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'six_months', label: '6 meses' },
  { value: 'lifetime', label: 'Siempre' },
] as const;

export type WeightChartRange = (typeof weightChartRangeOptions)[number]['value'];

/** Day-count windows (not calendar months) — same convention as the rest of the app's date math (e.g. RECURRING_SCHEDULE_LOOKAHEAD_WEEKS), simpler than month-boundary arithmetic and avoids Feb/30-vs-31-day edge cases. */
const RANGE_DAYS: Record<Exclude<WeightChartRange, 'lifetime'>, number> = {
  week: 7,
  month: 30,
  six_months: 182,
};

export type WeightLogPoint = { date: string };

/**
 * Filters logs (assumed already sorted ascending by date) to the given
 * window ending on `today`. String comparison works directly because
 * `date` is always an ISO `YYYY-MM-DD` key, where lexicographic order
 * matches chronological order.
 */
export function filterLogsByRange<T extends WeightLogPoint>(logs: T[], range: WeightChartRange, today: Date): T[] {
  if (range === 'lifetime') return logs;

  const days = RANGE_DAYS[range];
  const cutoffKey = toDateKey(addDays(today, -(days - 1)));
  return logs.filter((log) => log.date >= cutoffKey);
}
