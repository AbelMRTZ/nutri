import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMealItem, type MealItemInsert } from '@/features/meals/api/mealItems';
import { mealItemsQueryKey } from '@/features/meals/hooks/useMealItems';

export function useCreateMealItem(mealId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insert: MealItemInsert) => createMealItem(insert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealItemsQueryKey(mealId) });
    },
  });
}
