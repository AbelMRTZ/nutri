import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createFood, type FoodInsert } from '@/features/foods/api/foods';
import { foodQueryKey } from '@/features/foods/hooks/useFood';
import { foodsQueryKey } from '@/features/foods/hooks/useFoods';

export function useCreateFood(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insert: Omit<FoodInsert, 'user_id'>) => createFood({ ...insert, user_id: userId as string }),
    onSuccess: (data) => {
      queryClient.setQueryData(foodQueryKey(data.id), data);
      queryClient.invalidateQueries({ queryKey: foodsQueryKey(userId) });
    },
  });
}
