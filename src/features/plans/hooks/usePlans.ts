import { useQuery } from '@tanstack/react-query';

import { listPlans } from '@/features/plans/api/plans';

export const plansQueryKey = (userId: string | undefined) => ['plans', userId] as const;

export function usePlans(userId: string | undefined) {
  return useQuery({
    queryKey: plansQueryKey(userId),
    queryFn: () => listPlans(userId as string),
    enabled: !!userId,
  });
}
