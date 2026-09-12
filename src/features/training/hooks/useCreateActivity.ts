import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createActivity } from '@/features/training/api/calendarActivities';
import { dayActivitiesQueryKey } from '@/features/training/hooks/useDayActivities';
import type { TablesInsert } from '@/lib/supabase/database.types';

export function useCreateActivity(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: TablesInsert<'calendar_activities'>) => createActivity(activity),
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: dayActivitiesQueryKey(userId, activity.date) });
      queryClient.invalidateQueries({ queryKey: ['activity-dates-range', userId] });
    },
  });
}
