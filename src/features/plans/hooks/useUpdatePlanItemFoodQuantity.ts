import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePlanItemFoodQuantity } from '@/features/plans/api/planItemFoods';
import { planItemsQueryKey } from '@/features/plans/hooks/usePlanItems';

export function useUpdatePlanItemFoodQuantity(planId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => updatePlanItemFoodQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planItemsQueryKey(planId) });
    },
  });
}
