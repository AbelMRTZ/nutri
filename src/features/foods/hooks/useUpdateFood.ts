import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateFood, type FoodUpdate } from '@/features/foods/api/foods';
import { foodQueryKey } from '@/features/foods/hooks/useFood';
import { foodsQueryKey } from '@/features/foods/hooks/useFoods';

export function useUpdateFood(id: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: FoodUpdate) => updateFood(id as string, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(foodQueryKey(id), data);
      queryClient.invalidateQueries({ queryKey: foodsQueryKey(userId) });
    },
  });
}
