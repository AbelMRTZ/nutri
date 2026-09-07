import { useQuery } from '@tanstack/react-query';

import { getCalendarDay } from '@/features/calendar/api/calendarDays';

export const calendarDayQueryKey = (userId: string | undefined, date: string) =>
  ['calendar-day', userId, date] as const;

export function useCalendarDay(userId: string | undefined, date: string) {
  return useQuery({
    queryKey: calendarDayQueryKey(userId, date),
    queryFn: () => getCalendarDay(userId as string, date),
    enabled: !!userId,
  });
}
