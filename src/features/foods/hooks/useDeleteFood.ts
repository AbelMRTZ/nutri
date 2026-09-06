import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteFood } from '@/features/foods/api/foods';
import { foodQueryKey } from '@/features/foods/hooks/useFood';
import { foodsQueryKey } from '@/features/foods/hooks/useFoods';

export function useDeleteFood(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFood(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: foodQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: foodsQueryKey(userId) });
    },
  });
}
