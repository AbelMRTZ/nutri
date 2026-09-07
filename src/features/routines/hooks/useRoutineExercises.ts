import { useQuery } from '@tanstack/react-query';

import { listRoutineExercises } from '@/features/routines/api/routineExercises';

export const routineExercisesQueryKey = (routineId: string | undefined) => ['routineExercises', routineId] as const;

export function useRoutineExercises(routineId: string | undefined) {
  return useQuery({
    queryKey: routineExercisesQueryKey(routineId),
    queryFn: () => listRoutineExercises(routineId as string),
    enabled: !!routineId,
  });
}
