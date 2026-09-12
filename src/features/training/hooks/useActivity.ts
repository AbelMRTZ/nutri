import { useQuery } from '@tanstack/react-query';

import { getActivity } from '@/features/training/api/calendarActivities';

export const activityQueryKey = (id: string | undefined) => ['activity', id] as const;

export function useActivity(id: string | undefined) {
  return useQuery({
    queryKey: activityQueryKey(id),
    queryFn: () => getActivity(id as string),
    enabled: !!id,
  });
}
