import { useQuery } from '@tanstack/react-query';

import { listExercises } from '@/features/exercises/api/exercises';

export const exercisesQueryKey = (userId: string | undefined) => ['exercises', userId] as const;

export function useExercises(userId: string | undefined) {
  return useQuery({
    queryKey: exercisesQueryKey(userId),
    queryFn: () => listExercises(userId as string),
    enabled: !!userId,
  });
}
