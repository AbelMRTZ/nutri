import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMealItem } from '@/features/meals/api/mealItems';
import { mealItemsQueryKey } from '@/features/meals/hooks/useMealItems';

export function useDeleteMealItem(mealId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMealItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealItemsQueryKey(mealId) });
    },
  });
}
