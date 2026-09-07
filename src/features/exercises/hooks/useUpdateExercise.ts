import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateExercise, type ExerciseUpdate } from '@/features/exercises/api/exercises';
import { exerciseQueryKey } from '@/features/exercises/hooks/useExercise';
import { exercisesQueryKey } from '@/features/exercises/hooks/useExercises';

export function useUpdateExercise(id: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: ExerciseUpdate) => updateExercise(id as string, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(exerciseQueryKey(id), data);
      queryClient.invalidateQueries({ queryKey: exercisesQueryKey(userId) });
    },
  });
}
