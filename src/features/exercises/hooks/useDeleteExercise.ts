import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteExercise } from '@/features/exercises/api/exercises';
import { exerciseQueryKey } from '@/features/exercises/hooks/useExercise';
import { exercisesQueryKey } from '@/features/exercises/hooks/useExercises';

export function useDeleteExercise(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: exerciseQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: exercisesQueryKey(userId) });
    },
  });
}
