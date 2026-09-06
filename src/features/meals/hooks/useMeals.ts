import { useQuery } from '@tanstack/react-query';

import { listMeals } from '@/features/meals/api/meals';

export const mealsQueryKey = (userId: string | undefined) => ['meals', userId] as const;

export function useMeals(userId: string | undefined) {
  return useQuery({
    queryKey: mealsQueryKey(userId),
    queryFn: () => listMeals(userId as string),
    enabled: !!userId,
  });
}
