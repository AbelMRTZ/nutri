import { useQuery } from '@tanstack/react-query';

import { listSavedActivities } from '@/features/training/api/savedActivities';

export const savedActivitiesQueryKey = (userId: string | undefined) => ['saved-activities', userId] as const;

export function useSavedActivities(userId: string | undefined) {
  return useQuery({
    queryKey: savedActivitiesQueryKey(userId),
    queryFn: () => listSavedActivities(userId as string),
    enabled: !!userId,
  });
}
