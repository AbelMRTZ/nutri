import { useMutation, useQueryClient } from '@tanstack/react-query';

import { upsertWeightLog, type WeightLogUpsert } from '@/features/weight/api/weightLogs';
import { weightLogsQueryKey } from '@/features/weight/hooks/useWeightLogs';

export function useUpsertWeightLog(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (upsert: Omit<WeightLogUpsert, 'user_id'>) =>
      upsertWeightLog({ ...upsert, user_id: userId as string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weightLogsQueryKey(userId) });
    },
  });
}
