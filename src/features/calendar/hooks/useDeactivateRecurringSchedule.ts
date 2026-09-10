import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deactivateRecurringSchedule, deleteFutureScheduledDays } from '@/features/calendar/api/planRecurringSchedules';
import { activeRecurringScheduleQueryKey } from '@/features/calendar/hooks/useActiveRecurringSchedule';
import { toDateKey } from '@/lib/dates';
import type { Tables } from '@/lib/supabase/database.types';

export function useDeactivateRecurringSchedule(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: Tables<'plan_recurring_schedules'>) => {
      await deactivateRecurringSchedule(schedule.id);
      // Only today-onward — past days are history and stay untouched.
      await deleteFutureScheduledDays(schedule.id, toDateKey(new Date()));
      return schedule;
    },
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: activeRecurringScheduleQueryKey(schedule.plan_id) });
      queryClient.invalidateQueries({ queryKey: ['calendar-day'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-days-range', userId] });
    },
  });
}
