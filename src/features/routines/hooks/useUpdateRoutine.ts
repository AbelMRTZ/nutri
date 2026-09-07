import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateRoutine, type RoutineUpdate } from '@/features/routines/api/routines';
import { routineQueryKey } from '@/features/routines/hooks/useRoutine';
import { routinesQueryKey } from '@/features/routines/hooks/useRoutines';

export function useUpdateRoutine(id: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: RoutineUpdate) => updateRoutine(id as string, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(routineQueryKey(id), data);
      queryClient.invalidateQueries({ queryKey: routinesQueryKey(userId) });
    },
  });
}
