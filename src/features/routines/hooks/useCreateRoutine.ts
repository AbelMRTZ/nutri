import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRoutine, type RoutineInsert } from '@/features/routines/api/routines';
import { routineQueryKey } from '@/features/routines/hooks/useRoutine';
import { routinesQueryKey } from '@/features/routines/hooks/useRoutines';

export function useCreateRoutine(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insert: Omit<RoutineInsert, 'user_id'>) => createRoutine({ ...insert, user_id: userId as string }),
    onSuccess: (data) => {
      queryClient.setQueryData(routineQueryKey(data.id), data);
      queryClient.invalidateQueries({ queryKey: routinesQueryKey(userId) });
    },
  });
}
