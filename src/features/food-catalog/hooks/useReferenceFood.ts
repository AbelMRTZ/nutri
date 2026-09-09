import { useQuery } from '@tanstack/react-query';

import { getReferenceFood } from '@/features/food-catalog/api/referenceFoods';

export const referenceFoodQueryKey = (id: string | undefined) => ['reference-food', id] as const;

export function useReferenceFood(id: string | undefined) {
  return useQuery({
    queryKey: referenceFoodQueryKey(id),
    queryFn: () => getReferenceFood(id as string),
    enabled: !!id,
  });
}
