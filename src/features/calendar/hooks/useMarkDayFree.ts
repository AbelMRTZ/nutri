import { useMutation, useQueryClient } from '@tanstack/react-query';

import { upsertCalendarDay } from '@/features/calendar/api/calendarDays';
import { calendarDayQueryKey } from '@/features/calendar/hooks/useCalendarDay';

export function useMarkDayFree(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => upsertCalendarDay({ user_id: userId as string, date, plan_id: null, is_free: true }),
    onSuccess: (_data, date) => {
      queryClient.invalidateQueries({ queryKey: calendarDayQueryKey(userId, date) });
      queryClient.invalidateQueries({ queryKey: ['calendar-days-range', userId] });
    },
  });
}
