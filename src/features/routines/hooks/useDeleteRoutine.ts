import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRoutine } from '@/features/routines/api/routines';
import { routineQueryKey } from '@/features/routines/hooks/useRoutine';
import { routinesQueryKey } from '@/features/routines/hooks/useRoutines';

export function useDeleteRoutine(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoutine(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: routineQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: routinesQueryKey(userId) });
    },
  });
}
