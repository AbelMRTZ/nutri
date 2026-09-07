import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateRoutineExercise, type RoutineExerciseUpdate } from '@/features/routines/api/routineExercises';
import { routineExercisesQueryKey } from '@/features/routines/hooks/useRoutineExercises';

export function useUpdateRoutineExercise(routineId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: RoutineExerciseUpdate }) => updateRoutineExercise(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineExercisesQueryKey(routineId) });
    },
  });
}
