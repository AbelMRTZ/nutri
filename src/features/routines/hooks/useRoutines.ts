import { useQuery } from '@tanstack/react-query';

import { listRoutines } from '@/features/routines/api/routines';

export const routinesQueryKey = (userId: string | undefined) => ['routines', userId] as const;

export function useRoutines(userId: string | undefined) {
  return useQuery({
    queryKey: routinesQueryKey(userId),
    queryFn: () => listRoutines(userId as string),
    enabled: !!userId,
  });
}
