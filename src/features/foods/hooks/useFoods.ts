import { useQuery } from '@tanstack/react-query';

import { listFoods } from '@/features/foods/api/foods';

export const foodsQueryKey = (userId: string | undefined) => ['foods', userId] as const;

export function useFoods(userId: string | undefined) {
  return useQuery({
    queryKey: foodsQueryKey(userId),
    queryFn: () => listFoods(userId as string),
    enabled: !!userId,
  });
}
