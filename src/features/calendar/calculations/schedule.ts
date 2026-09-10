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

/**
 * Turns "N semanas, contando la actual" into the day-count
 * `generateScheduleDates` expects. Week 1 is only the *remaining* days of
 * the calendar week containing `startDate` (Monday-Sunday) — so starting on
 * a Wednesday, "1 semana" covers just Wed-Sun, not a full 7 days — and every
 * additional week is a full Monday-Sunday block after that.
 */
export function weeksToDays(startDate: Date, weeks: number): number {
  if (weeks <= 0) return 0;
  const day = startDate.getDay(); // 0=Sun..6=Sat
  const daysLeftInCurrentWeek = day === 0 ? 1 : 8 - day;
  return daysLeftInCurrentWeek + (weeks - 1) * 7;
}

/**
 * "Repetir indefinidamente" can't literally store infinite rows — instead a
 * generous batch is materialized upfront, and topped up (see
 * useTopUpRecurringSchedules) once the remaining window runs low. Shared
 * here so the initial batch (PlanScheduleScreen) and every later top-up use
 * the exact same sizing.
 */
export const RECURRING_SCHEDULE_LOOKAHEAD_WEEKS = 52;
export const RECURRING_SCHEDULE_TOPUP_THRESHOLD_WEEKS = 8;
