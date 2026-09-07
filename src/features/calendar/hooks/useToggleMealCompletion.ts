import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markMealCompleted, unmarkMealCompleted } from '@/features/calendar/api/planItemCompletions';
import { calendarDayCompletionsQueryKey } from '@/features/calendar/hooks/useCalendarDayCompletions';

export function useToggleMealCompletion(calendarDayId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planItemId, completed }: { planItemId: string; completed: boolean }) =>
      completed
        ? markMealCompleted(calendarDayId as string, planItemId)
        : unmarkMealCompleted(calendarDayId as string, planItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarDayCompletionsQueryKey(calendarDayId) });
    },
  });
}
