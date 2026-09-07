import { useQuery } from '@tanstack/react-query';

import { getRoutine } from '@/features/routines/api/routines';

export const routineQueryKey = (id: string | undefined) => ['routine', id] as const;

export function useRoutine(id: string | undefined) {
  return useQuery({
    queryKey: routineQueryKey(id),
    queryFn: () => getRoutine(id as string),
    enabled: !!id,
  });
}
