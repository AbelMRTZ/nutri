import { useQuery } from '@tanstack/react-query';

import { getActiveScheduleForPlan } from '@/features/calendar/api/planRecurringSchedules';

export const activeRecurringScheduleQueryKey = (planId: string | undefined) => ['plan-recurring-schedule', planId] as const;

export function useActiveRecurringSchedule(planId: string | undefined) {
  return useQuery({
    queryKey: activeRecurringScheduleQueryKey(planId),
    queryFn: () => getActiveScheduleForPlan(planId as string),
    enabled: !!planId,
  });
}
