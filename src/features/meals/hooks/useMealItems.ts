import { useQuery } from '@tanstack/react-query';

import { listMealItems } from '@/features/meals/api/mealItems';

export const mealItemsQueryKey = (mealId: string | undefined) => ['mealItems', mealId] as const;

export function useMealItems(mealId: string | undefined) {
  return useQuery({
    queryKey: mealItemsQueryKey(mealId),
    queryFn: () => listMealItems(mealId as string),
    enabled: !!mealId,
  });
}
