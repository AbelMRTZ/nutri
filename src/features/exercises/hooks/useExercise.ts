import { useQuery } from '@tanstack/react-query';

import { getExercise } from '@/features/exercises/api/exercises';

export const exerciseQueryKey = (id: string | undefined) => ['exercise', id] as const;

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: exerciseQueryKey(id),
    queryFn: () => getExercise(id as string),
    enabled: !!id,
  });
}
