import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateRoutineExerciseSortOrder } from '@/features/routines/api/routineExercises';
import { routineExercisesQueryKey } from '@/features/routines/hooks/useRoutineExercises';

export function useReorderRoutineExercises(routineId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { id: string; sort_order: number }[]) =>
      Promise.all(items.map(({ id, sort_order }) => updateRoutineExerciseSortOrder(id, sort_order))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineExercisesQueryKey(routineId) });
    },
  });
}
