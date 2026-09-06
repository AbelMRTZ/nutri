import { supabase } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/supabase/database.types';

export type PlanItemFoodInsert = TablesInsert<'plan_item_foods'>;

export async function createPlanItemFoods(rows: PlanItemFoodInsert[]) {
  if (rows.length === 0) return [];
  const { data, error } = await supabase.from('plan_item_foods').insert(rows).select();
  if (error) throw error;
  return data;
}

export async function updatePlanItemFoodQuantity(id: string, quantity: number) {
  const { error } = await supabase.from('plan_item_foods').update({ quantity }).eq('id', id);
  if (error) throw error;
}
