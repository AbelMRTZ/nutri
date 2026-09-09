import { useQuery } from '@tanstack/react-query';

import { getReferenceFoodNutrients } from '@/features/food-catalog/api/referenceFoods';

export const referenceFoodNutrientsQueryKey = (id: string | undefined) => ['reference-food-nutrients', id] as const;

export function useReferenceFoodNutrients(id: string | undefined) {
  return useQuery({
    queryKey: referenceFoodNutrientsQueryKey(id),
    queryFn: () => getReferenceFoodNutrients(id as string),
    enabled: !!id,
  });
}
