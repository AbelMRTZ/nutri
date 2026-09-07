import { useMutation, useQueryClient } from '@tanstack/react-query';

import { upsertCalendarDays, type CalendarDayUpsert } from '@/features/calendar/api/calendarDays';

export function useApplyPlanSchedule(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rows: CalendarDayUpsert[]) => upsertCalendarDays(rows),
    onSuccess: () => {
      // A schedule touches many dates at once, so invalidate broadly by key
      // prefix instead of one invalidateQueries call per affected date.
      queryClient.invalidateQueries({ queryKey: ['calendar-day'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-days-range', userId] });
    },
  });
}
