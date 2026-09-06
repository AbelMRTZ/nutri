import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlan, type PlanUpdate } from '@/features/plans/api/plans';
import { planQueryKey } from '@/features/plans/hooks/usePlan';
import { plansQueryKey } from '@/features/plans/hooks/usePlans';

export function useUpdatePlan(id: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: PlanUpdate) => updatePlan(id as string, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(planQueryKey(id), data);
      queryClient.invalidateQueries({ queryKey: plansQueryKey(userId) });
    },
  });
}
