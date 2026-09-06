import { useQuery } from '@tanstack/react-query';

import { getFood } from '@/features/foods/api/foods';

export const foodQueryKey = (id: string | undefined) => ['food', id] as const;

export function useFood(id: string | undefined) {
  return useQuery({
    queryKey: foodQueryKey(id),
    queryFn: () => getFood(id as string),
    enabled: !!id,
  });
}
