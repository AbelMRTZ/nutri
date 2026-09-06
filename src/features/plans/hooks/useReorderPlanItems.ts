import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlanItemSortOrder } from '@/features/plans/api/planItems';
import { planItemsQueryKey } from '@/features/plans/hooks/usePlanItems';

export function useReorderPlanItems(planId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { id: string; sort_order: number }[]) =>
      Promise.all(items.map(({ id, sort_order }) => updatePlanItemSortOrder(id, sort_order))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planItemsQueryKey(planId) });
    },
  });
}
