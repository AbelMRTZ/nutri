import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateActivity } from '@/features/training/api/calendarActivities';
import { activityQueryKey } from '@/features/training/hooks/useActivity';
import { dayActivitiesQueryKey } from '@/features/training/hooks/useDayActivities';
import type { TablesUpdate } from '@/lib/supabase/database.types';

export function useUpdateActivity(id: string, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: TablesUpdate<'calendar_activities'>) => updateActivity(id, updates),
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: activityQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: dayActivitiesQueryKey(userId, activity.date) });
      queryClient.invalidateQueries({ queryKey: ['activity-dates-range', userId] });
    },
  });
}
