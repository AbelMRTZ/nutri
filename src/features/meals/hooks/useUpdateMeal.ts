import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMeal, type MealUpdate } from '@/features/meals/api/meals';
import { mealQueryKey } from '@/features/meals/hooks/useMeal';
import { mealsQueryKey } from '@/features/meals/hooks/useMeals';

export function useUpdateMeal(id: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: MealUpdate) => updateMeal(id as string, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(mealQueryKey(id), data);
      queryClient.invalidateQueries({ queryKey: mealsQueryKey(userId) });
    },
  });
}
