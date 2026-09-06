import { useQuery } from '@tanstack/react-query';

import { listPlanItems } from '@/features/plans/api/planItems';

export const planItemsQueryKey = (planId: string | undefined) => ['planItems', planId] as const;

export function usePlanItems(planId: string | undefined) {
  return useQuery({
    queryKey: planItemsQueryKey(planId),
    queryFn: () => listPlanItems(planId as string),
    enabled: !!planId,
  });
}
