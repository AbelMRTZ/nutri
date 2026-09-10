import { useEffect, useRef } from 'react';

import { upsertCalendarDays } from '@/features/calendar/api/calendarDays';
import { getLatestScheduledDate, listActiveSchedules } from '@/features/calendar/api/planRecurringSchedules';
import {
  generateScheduleDates,
  RECURRING_SCHEDULE_LOOKAHEAD_WEEKS,
  RECURRING_SCHEDULE_TOPUP_THRESHOLD_WEEKS,
} from '@/features/calendar/calculations/schedule';
import { addDays, fromDateKey, toDateKey } from '@/lib/dates';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Best-effort background maintenance for "repetir indefinidamente" schedules:
 * calendar_days only ever holds a finite batch of materialized rows (see
 * RECURRING_SCHEDULE_LOOKAHEAD_WEEKS), so an active schedule would silently
 * stop repeating once that batch runs out. Runs once per signed-in session
 * (guarded by a ref, not a query) whenever the Calendar screen mounts, and
 * tops up any schedule whose remaining lookahead has dropped below the
 * threshold — quietly, with no loading/error UI, since nothing on screen
 * depends on it succeeding immediately.
 */
export function useTopUpRecurringSchedules(userId: string | undefined) {
  const ranForUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!userId || ranForUserId.current === userId) return;
    ranForUserId.current = userId;

    async function topUp() {
      const schedules = await listActiveSchedules(userId as string);
      const today = new Date();

      for (const schedule of schedules) {
        const latestDateKey = await getLatestScheduledDate(schedule.id);
        const latestDate = latestDateKey ? fromDateKey(latestDateKey) : addDays(today, -1);
        const weeksRemaining = (latestDate.getTime() - today.getTime()) / MS_PER_WEEK;
        if (weeksRemaining >= RECURRING_SCHEDULE_TOPUP_THRESHOLD_WEEKS) continue;

        const nextStart = addDays(latestDate, 1);
        const dates = generateScheduleDates(nextStart, RECURRING_SCHEDULE_LOOKAHEAD_WEEKS * 7, new Set(schedule.weekdays));
        if (dates.length === 0) continue;

        await upsertCalendarDays(
          dates.map((date) => ({
            user_id: userId as string,
            date: toDateKey(date),
            plan_id: schedule.plan_id,
            is_free: false,
            plan_schedule_id: schedule.id,
          })),
        );
      }
    }

    topUp().catch(() => {
      // Silent, best-effort: a failed top-up just gets retried next time the
      // Calendar screen mounts, with no user-facing action to take.
    });
  }, [userId]);
}
