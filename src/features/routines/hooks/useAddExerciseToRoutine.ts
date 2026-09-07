import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRoutineExercise } from '@/features/routines/api/routineExercises';
import { routineExercisesQueryKey } from '@/features/routines/hooks/useRoutineExercises';

const DEFAULT_SETS = 3;
const DEFAULT_REPS = 10;

/** Adds an exercise to the routine with sensible starting sets/reps — the user tweaks them inline afterward. */
export function useAddExerciseToRoutine(routineId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => {
      const currentItems = queryClient.getQueryData<{ sort_order: number }[]>(routineExercisesQueryKey(routineId)) ?? [];
      return createRoutineExercise({
        routine_id: routineId as string,
        exercise_id: exerciseId,
        sets: DEFAULT_SETS,
        reps: DEFAULT_REPS,
        weight_kg: null,
        sort_order: currentItems.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineExercisesQueryKey(routineId) });
    },
  });
}
