import { useQuery } from '@tanstack/react-query';

import { listActivityDatesInRange } from '@/features/training/api/calendarActivities';

export const activityDatesInRangeQueryKey = (userId: string | undefined, startDate: string, endDate: string) =>
  ['activity-dates-range', userId, startDate, endDate] as const;

/** Dates (within range) that have at least one activity — for day-strip indicators. */
export function useActivityDatesInRange(userId: string | undefined, startDate: string, endDate: string) {
  return useQuery({
    queryKey: activityDatesInRangeQueryKey(userId, startDate, endDate),
    queryFn: async () => {
      const rows = await listActivityDatesInRange(userId as string, startDate, endDate);
      return new Set(rows.map((row) => row.date));
    },
    enabled: !!userId,
  });
}
