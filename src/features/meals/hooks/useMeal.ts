import { useQuery } from '@tanstack/react-query';

import { getMeal } from '@/features/meals/api/meals';

export const mealQueryKey = (id: string | undefined) => ['meal', id] as const;

export function useMeal(id: string | undefined) {
  return useQuery({
    queryKey: mealQueryKey(id),
    queryFn: () => getMeal(id as string),
    enabled: !!id,
  });
}
