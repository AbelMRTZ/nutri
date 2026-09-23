import { useQuery } from '@tanstack/react-query';

import { listWeightLogs } from '@/features/weight/api/weightLogs';

export const weightLogsQueryKey = (userId: string | undefined) => ['weightLogs', userId] as const;

/** Ascending by date — every consumer (the chart, the entry dialog's "already logged" lookup) wants oldest-first. */
export function useWeightLogs(userId: string | undefined) {
  return useQuery({
    queryKey: weightLogsQueryKey(userId),
    queryFn: () => listWeightLogs(userId as string),
    enabled: !!userId,
  });
}
