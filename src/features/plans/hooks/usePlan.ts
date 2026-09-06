import { useQuery } from '@tanstack/react-query';

import { getPlan } from '@/features/plans/api/plans';

export const planQueryKey = (id: string | undefined) => ['plan', id] as const;

export function usePlan(id: string | undefined) {
  return useQuery({
    queryKey: planQueryKey(id),
    queryFn: () => getPlan(id as string),
    enabled: !!id,
  });
}
