import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSavedActivity } from '@/features/training/api/savedActivities';
import { savedActivitiesQueryKey } from '@/features/training/hooks/useSavedActivities';
import type { TablesInsert } from '@/lib/supabase/database.types';

export function useCreateSavedActivity(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: TablesInsert<'saved_activities'>) => createSavedActivity(activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedActivitiesQueryKey(userId) });
    },
  });
}
