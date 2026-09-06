import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePlanItem } from '@/features/plans/api/planItems';
import { planItemsQueryKey } from '@/features/plans/hooks/usePlanItems';

export function useDeletePlanItem(planId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlanItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planItemsQueryKey(planId) });
    },
  });
}
