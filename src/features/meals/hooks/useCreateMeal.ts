import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMeal, type MealInsert } from '@/features/meals/api/meals';
import { mealQueryKey } from '@/features/meals/hooks/useMeal';
import { mealsQueryKey } from '@/features/meals/hooks/useMeals';

export function useCreateMeal(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insert: Omit<MealInsert, 'user_id'>) => createMeal({ ...insert, user_id: userId as string }),
    onSuccess: (data) => {
      queryClient.setQueryData(mealQueryKey(data.id), data);
      queryClient.invalidateQueries({ queryKey: mealsQueryKey(userId) });
    },
  });
}
