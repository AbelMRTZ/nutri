import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteWeightLog } from '@/features/weight/api/weightLogs';
import { weightLogsQueryKey } from '@/features/weight/hooks/useWeightLogs';

export function useDeleteWeightLog(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWeightLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weightLogsQueryKey(userId) });
    },
  });
}
