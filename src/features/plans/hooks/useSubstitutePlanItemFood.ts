import { useMutation, useQueryClient } from '@tanstack/react-query';

import { substitutePlanItemFood } from '@/features/plans/api/planItemFoods';
import { planItemsQueryKey } from '@/features/plans/hooks/usePlanItems';

export function useSubstitutePlanItemFood(planId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, foodId, quantity }: { id: string; foodId: string; quantity: number }) =>
      substitutePlanItemFood(id, foodId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planItemsQueryKey(planId) });
    },
  });
}
