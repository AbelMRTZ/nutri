import { useMutation, useQueryClient } from '@tanstack/react-query';

import { listMealItems } from '@/features/meals';
import { createPlanItem, deletePlanItem } from '@/features/plans/api/planItems';
import { createPlanItemFoods } from '@/features/plans/api/planItemFoods';
import { planItemsQueryKey } from '@/features/plans/hooks/usePlanItems';

/**
 * Adds a meal to a plan by snapshotting its current meal_items into new
 * plan-scoped rows, at the meal's own quantities — so later edits here never
 * mutate the original meal. Two sequential writes (no RPC precedent in this
 * codebase, and RLS already scopes everything to the authenticated user), but
 * guarded with a compensating rollback: if the bulk food-copy fails, the
 * just-created empty plan_item is deleted rather than left as a ghost meal
 * group with no foods.
 */
export function useAddMealToPlan(planId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealId: string) => {
      const currentItems = queryClient.getQueryData<{ sort_order: number }[]>(planItemsQueryKey(planId)) ?? [];
      const planItem = await createPlanItem({
        plan_id: planId as string,
        meal_id: mealId,
        sort_order: currentItems.length,
      });

      const mealItems = await listMealItems(mealId);
      if (mealItems.length > 0) {
        try {
          await createPlanItemFoods(
            mealItems.map((item) => ({
              plan_item_id: planItem.id,
              food_id: item.food_id,
              quantity: item.quantity,
              is_variable: item.is_variable,
            })),
          );
        } catch (error) {
          await deletePlanItem(planItem.id).catch(() => {});
          throw error;
        }
      }

      return planItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planItemsQueryKey(planId) });
    },
  });
}
