import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPlan, type PlanInsert } from '@/features/plans/api/plans';
import { planQueryKey } from '@/features/plans/hooks/usePlan';
import { plansQueryKey } from '@/features/plans/hooks/usePlans';

export function useCreatePlan(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insert: Omit<PlanInsert, 'user_id'>) => createPlan({ ...insert, user_id: userId as string }),
    onSuccess: (data) => {
      queryClient.setQueryData(planQueryKey(data.id), data);
      queryClient.invalidateQueries({ queryKey: plansQueryKey(userId) });
    },
  });
}
