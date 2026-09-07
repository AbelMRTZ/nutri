import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRoutineExercise } from '@/features/routines/api/routineExercises';
import { routineExercisesQueryKey } from '@/features/routines/hooks/useRoutineExercises';

export function useDeleteRoutineExercise(routineId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoutineExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineExercisesQueryKey(routineId) });
    },
  });
}
