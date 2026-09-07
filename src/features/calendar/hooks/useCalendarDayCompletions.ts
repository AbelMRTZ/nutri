import { useQuery } from '@tanstack/react-query';

import { listCompletionsForDay } from '@/features/calendar/api/planItemCompletions';

export const calendarDayCompletionsQueryKey = (calendarDayId: string | undefined) =>
  ['calendar-day-completions', calendarDayId] as const;

export function useCalendarDayCompletions(calendarDayId: string | undefined) {
  return useQuery({
    queryKey: calendarDayCompletionsQueryKey(calendarDayId),
    queryFn: () => listCompletionsForDay(calendarDayId as string),
    enabled: !!calendarDayId,
  });
}
