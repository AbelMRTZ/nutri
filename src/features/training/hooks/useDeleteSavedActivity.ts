import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteSavedActivity } from '@/features/training/api/savedActivities';
import { savedActivitiesQueryKey } from '@/features/training/hooks/useSavedActivities';

export function useDeleteSavedActivity(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSavedActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedActivitiesQueryKey(userId) });
    },
  });
}
