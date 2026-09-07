import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createExercise, type ExerciseInsert } from '@/features/exercises/api/exercises';
import { exerciseQueryKey } from '@/features/exercises/hooks/useExercise';
import { exercisesQueryKey } from '@/features/exercises/hooks/useExercises';

export function useCreateExercise(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insert: Omit<ExerciseInsert, 'user_id'>) => createExercise({ ...insert, user_id: userId as string }),
    onSuccess: (data) => {
      queryClient.setQueryData(exerciseQueryKey(data.id), data);
      queryClient.invalidateQueries({ queryKey: exercisesQueryKey(userId) });
    },
  });
}
