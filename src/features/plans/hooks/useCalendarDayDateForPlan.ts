import { useQuery } from '@tanstack/react-query';

import { getCalendarDayDateForPlan } from '@/features/plans/api/planInstances';

export const calendarDayDateForPlanQueryKey = (planId: string | undefined) =>
  ['calendar-day-date-for-plan', planId] as const;

/** Only meaningful for an is_calendar_instance plan — pass `enabled` accordingly. */
export function useCalendarDayDateForPlan(planId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: calendarDayDateForPlanQueryKey(planId),
    queryFn: () => getCalendarDayDateForPlan(planId as string),
    enabled: !!planId && enabled,
  });
}
