import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markRoutineExerciseCompleted, unmarkRoutineExerciseCompleted } from '@/features/calendar/api/routineExerciseCompletions';
import { calendarDayRoutineCompletionsQueryKey } from '@/features/calendar/hooks/useCalendarDayRoutineCompletions';

export function useToggleRoutineExerciseCompletion(calendarDayId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routineExerciseId, completed }: { routineExerciseId: string; completed: boolean }) =>
      completed
        ? markRoutineExerciseCompleted(calendarDayId as string, routineExerciseId)
        : unmarkRoutineExerciseCompleted(calendarDayId as string, routineExerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarDayRoutineCompletionsQueryKey(calendarDayId) });
    },
  });
}
