import { useQuery } from '@tanstack/react-query';

import { listActivitiesForDate } from '@/features/training/api/calendarActivities';

export const dayActivitiesQueryKey = (userId: string | undefined, date: string | undefined) =>
  ['day-activities', userId, date] as const;

export function useDayActivities(userId: string | undefined, date: string | undefined) {
  return useQuery({
    queryKey: dayActivitiesQueryKey(userId, date),
    queryFn: () => listActivitiesForDate(userId as string, date as string),
    enabled: !!userId && !!date,
  });
}
