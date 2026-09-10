import { useMutation, useQueryClient } from '@tanstack/react-query';

import { upsertCalendarDays } from '@/features/calendar/api/calendarDays';
import { createRecurringSchedule } from '@/features/calendar/api/planRecurringSchedules';
import { activeRecurringScheduleQueryKey } from '@/features/calendar/hooks/useActiveRecurringSchedule';
import { generateScheduleDates, RECURRING_SCHEDULE_LOOKAHEAD_WEEKS } from '@/features/calendar/calculations/schedule';
import { toDateKey } from '@/lib/dates';

export function useStartRecurringSchedule(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, weekdays }: { planId: string; weekdays: number[] }) => {
      const schedule = await createRecurringSchedule({ user_id: userId as string, plan_id: planId, weekdays });

      const dates = generateScheduleDates(new Date(), RECURRING_SCHEDULE_LOOKAHEAD_WEEKS * 7, new Set(weekdays));
      const rows = dates.map((date) => ({
        user_id: userId as string,
        date: toDateKey(date),
        plan_id: planId,
        is_free: false,
        plan_schedule_id: schedule.id,
      }));
      await upsertCalendarDays(rows);

      return schedule;
    },
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: activeRecurringScheduleQueryKey(schedule.plan_id) });
      queryClient.invalidateQueries({ queryKey: ['calendar-day'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-days-range', userId] });
    },
  });
}
