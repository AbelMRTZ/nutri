import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteActivity } from '@/features/training/api/calendarActivities';
import { dayActivitiesQueryKey } from '@/features/training/hooks/useDayActivities';

export function useDeleteActivity(userId: string | undefined, date: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dayActivitiesQueryKey(userId, date) });
      queryClient.invalidateQueries({ queryKey: ['activity-dates-range', userId] });
    },
  });
}
