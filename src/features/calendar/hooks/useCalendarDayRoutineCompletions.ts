import { useQuery } from '@tanstack/react-query';

import { listRoutineCompletionsForDay } from '@/features/calendar/api/routineExerciseCompletions';

export const calendarDayRoutineCompletionsQueryKey = (calendarDayId: string | undefined) =>
  ['calendar-day-routine-completions', calendarDayId] as const;

export function useCalendarDayRoutineCompletions(calendarDayId: string | undefined) {
  return useQuery({
    queryKey: calendarDayRoutineCompletionsQueryKey(calendarDayId),
    queryFn: () => listRoutineCompletionsForDay(calendarDayId as string),
    enabled: !!calendarDayId,
  });
}
