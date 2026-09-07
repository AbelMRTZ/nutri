import { useQuery } from '@tanstack/react-query';

import { listCalendarDaysInRange } from '@/features/calendar/api/calendarDays';

export const calendarDaysRangeQueryKey = (userId: string | undefined, startDate: string, endDate: string) =>
  ['calendar-days-range', userId, startDate, endDate] as const;

export function useCalendarDaysRange(userId: string | undefined, startDate: string, endDate: string) {
  return useQuery({
    queryKey: calendarDaysRangeQueryKey(userId, startDate, endDate),
    queryFn: () => listCalendarDaysInRange(userId as string, startDate, endDate),
    enabled: !!userId,
  });
}
