import { addDays } from '@/lib/dates';

/**
 * Every date in the `days`-day window starting at `startDate` (inclusive)
 * whose day-of-week — per `Date#getDay()`: 0=Sunday..6=Saturday — is in
 * `weekdays`. Pure so the picking logic for "repeat this plan" can be
 * tested without touching Supabase or the calendar UI.
 */
export function generateScheduleDates(startDate: Date, days: number, weekdays: Set<number>): Date[] {
  return Array.from({ length: Math.max(days, 0) }, (_, i) => addDays(startDate, i)).filter((date) =>
    weekdays.has(date.getDay()),
  );
}
