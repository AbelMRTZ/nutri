import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCalendarDay } from '@/features/calendar/api/calendarDays';
import { calendarDayQueryKey } from '@/features/calendar/hooks/useCalendarDay';

export function useRemoveDayAssignment(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; date: string }) => deleteCalendarDay(id),
    onSuccess: (_data, { date }) => {
      queryClient.invalidateQueries({ queryKey: calendarDayQueryKey(userId, date) });
      queryClient.invalidateQueries({ queryKey: ['calendar-days-range', userId] });
    },
  });
}
