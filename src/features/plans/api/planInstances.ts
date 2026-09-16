import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/database.types';

import { createPlan, deletePlan } from './plans';
import { createPlanItem, listPlanItems } from './planItems';
import { createPlanItemFoods } from './planItemFoods';

export type PlanInstanceForkResult = {
  plan: Tables<'plans'>;
  planItemIdMap: Map<string, string>;
};

/**
 * Clones a plan's editable contents (name/targets + plan_items +
 * plan_item_foods) into a brand-new plan flagged is_calendar_instance: true
 * — a private copy that never mutates `sourcePlan`. Sequential writes with a
 * compensating rollback on failure, same pattern as useAddMealToPlan (no RPC
 * precedent in this codebase): if anything after the initial createPlan
 * fails, the new plan is deleted, cascading away whatever partial
 * plan_items/plan_item_foods it had already picked up.
 */
export async function createPlanInstance(sourcePlan: Tables<'plans'>): Promise<PlanInstanceForkResult> {
  const newPlan = await createPlan({
    user_id: sourcePlan.user_id,
    name: sourcePlan.name,
    is_special: sourcePlan.is_special,
    calories_target: sourcePlan.calories_target,
    protein_g_target: sourcePlan.protein_g_target,
    carbs_g_target: sourcePlan.carbs_g_target,
    fat_g_target: sourcePlan.fat_g_target,
    is_calendar_instance: true,
  });

  try {
    const sourceItems = await listPlanItems(sourcePlan.id);
    const planItemIdMap = new Map<string, string>();

    for (const item of sourceItems) {
      const newItem = await createPlanItem({ plan_id: newPlan.id, meal_id: item.meal_id, sort_order: item.sort_order });
      planItemIdMap.set(item.id, newItem.id);
    }

    const foodRows = sourceItems.flatMap((item) =>
      item.plan_item_foods.map((pif) => ({
        plan_item_id: planItemIdMap.get(item.id) as string,
        food_id: pif.food_id,
        quantity: pif.quantity,
        is_variable: pif.is_variable,
      })),
    );
    await createPlanItemFoods(foodRows);

    return { plan: newPlan, planItemIdMap };
  } catch (error) {
    await deletePlan(newPlan.id).catch(() => {});
    throw error;
  }
}

/**
 * Bulk-deletes plans, but only the ones actually flagged as calendar
 * instances — this filter is itself the safety check that a shared template
 * plan_id swept up in `ids` (e.g. a recurring schedule's own plan_id) is
 * never touched.
 */
export async function deleteCalendarInstancePlans(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase.from('plans').delete().in('id', ids).eq('is_calendar_instance', true);
  if (error) throw error;
}

/**
 * The single calendar_days row that currently references a plan (by
 * construction, an is_calendar_instance plan is only ever assigned to
 * exactly one day — forking always repoints exactly one row, and instances
 * are filtered out of every plan picker so nothing can assign one to a
 * second day). Used to know which date's activities should adjust this
 * instance's targets when editing it directly. A plain query against
 * calendar_days (not an import from the calendar feature) — plans must
 * never depend on calendar, since calendar already depends on plans.
 */
export async function getCalendarDayDateForPlan(planId: string): Promise<string | null> {
  const { data, error } = await supabase.from('calendar_days').select('date').eq('plan_id', planId).maybeSingle();
  if (error) throw error;
  return data?.date ?? null;
}
