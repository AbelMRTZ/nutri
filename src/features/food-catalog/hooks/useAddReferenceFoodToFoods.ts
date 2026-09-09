import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getReferenceFood, getReferenceFoodNutrients } from '@/features/food-catalog/api/referenceFoods';
import { buildMaterializedFoodValues } from '@/features/food-catalog/nutrientMapping';
import { createFood, getFoodBySourceReferenceFoodId } from '@/features/foods/api/foods';
import { foodQueryKey } from '@/features/foods/hooks/useFood';
import { foodsQueryKey } from '@/features/foods/hooks/useFoods';

export type AddReferenceFoodResult =
  | { status: 'created' | 'reused'; foodId: string }
  | { status: 'cannot_materialize'; missingFields: string[] };

/**
 * "Añadir a mis alimentos": copies a catalog food into the user's own
 * `foods` (reusing the existing copy if they already added this one
 * before), so it then works everywhere in the app — meal picker, plan
 * substitution, the Alimentos list — completely unchanged, with zero
 * special-casing for where it came from. Never fabricates the required
 * energy/protein/fat/carbs columns when the source doesn't have them; see
 * `buildMaterializedFoodValues`.
 */
export function useAddReferenceFoodToFoods(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referenceFoodId: string): Promise<AddReferenceFoodResult> => {
      if (!userId) throw new Error('Missing userId');

      const existing = await getFoodBySourceReferenceFoodId(userId, referenceFoodId);
      if (existing) return { status: 'reused', foodId: existing.id };

      const [referenceFood, nutrientRows] = await Promise.all([
        getReferenceFood(referenceFoodId),
        getReferenceFoodNutrients(referenceFoodId),
      ]);

      const result = buildMaterializedFoodValues(nutrientRows);
      if (!result.canMaterialize) {
        return { status: 'cannot_materialize', missingFields: result.missingFields };
      }

      const created = await createFood({
        user_id: userId,
        name: referenceFood.name_es ?? referenceFood.name_original,
        serving_type: referenceFood.serving_type,
        category: referenceFood.category,
        source_reference_food_id: referenceFood.id,
        ...result.values,
      });

      return { status: 'created', foodId: created.id };
    },
    onSuccess: (result) => {
      if (result.status === 'cannot_materialize') return;
      queryClient.invalidateQueries({ queryKey: foodQueryKey(result.foodId) });
      queryClient.invalidateQueries({ queryKey: foodsQueryKey(userId) });
    },
  });
}
