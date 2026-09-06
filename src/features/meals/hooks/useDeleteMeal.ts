import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMeal } from '@/features/meals/api/meals';
import { mealQueryKey } from '@/features/meals/hooks/useMeal';
import { mealsQueryKey } from '@/features/meals/hooks/useMeals';

export function useDeleteMeal(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: mealQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: mealsQueryKey(userId) });
    },
  });
}
