import { supabase } from '@/lib/supabase/client';
import type { Tables, TablesInsert } from '@/lib/supabase/database.types';

export type PlanItemWithDetails = Tables<'plan_items'> & {
  meal: Tables<'meals'>;
  plan_item_foods: (Tables<'plan_item_foods'> & { food: Tables<'foods'> })[];
};

export async function listPlanItems(planId: string): Promise<PlanItemWithDetails[]> {
  const { data, error } = await supabase
    .from('plan_items')
    .select('*, meal:meals(*), plan_item_foods(*, food:foods(*))')
    .eq('plan_id', planId)
    .order('sort_order');
  if (error) throw error;
  return data as unknown as PlanItemWithDetails[];
}

export type PlanItemInsert = TablesInsert<'plan_items'>;

export async function createPlanItem(insert: PlanItemInsert) {
  const { data, error } = await supabase.from('plan_items').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updatePlanItemSortOrder(id: string, sortOrder: number) {
  const { error } = await supabase.from('plan_items').update({ sort_order: sortOrder }).eq('id', id);
  if (error) throw error;
}

export async function deletePlanItem(id: string) {
  const { error } = await supabase.from('plan_items').delete().eq('id', id);
  if (error) throw error;
}
