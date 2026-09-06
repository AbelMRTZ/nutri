import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePlan } from '@/features/plans/api/plans';
import { planQueryKey } from '@/features/plans/hooks/usePlan';
import { plansQueryKey } from '@/features/plans/hooks/usePlans';

export function useDeletePlan(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: planQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: plansQueryKey(userId) });
    },
  });
}
