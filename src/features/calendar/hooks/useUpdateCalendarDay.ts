import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCalendarDay } from '@/features/calendar/api/calendarDays';
import { calendarDayQueryKey } from '@/features/calendar/hooks/useCalendarDay';
import type { TablesUpdate } from '@/lib/supabase/database.types';

export function useUpdateCalendarDay(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; date: string; updates: TablesUpdate<'calendar_days'> }) =>
      updateCalendarDay(id, updates),
    onSuccess: (_data, { date }) => {
      queryClient.invalidateQueries({ queryKey: calendarDayQueryKey(userId, date) });
      queryClient.invalidateQueries({ queryKey: ['calendar-days-range', userId] });
    },
  });
}
