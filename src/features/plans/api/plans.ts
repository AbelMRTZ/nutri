import { supabase } from '@/lib/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

export async function listPlans(userId: string) {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('user_id', userId)
    .eq('is_calendar_instance', false)
    .order('name');
  if (error) throw error;
  return data;
}

export async function getPlan(id: string) {
  const { data, error } = await supabase.from('plans').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type PlanInsert = TablesInsert<'plans'>;
export type PlanUpdate = TablesUpdate<'plans'>;

export async function createPlan(insert: PlanInsert) {
  const { data, error } = await supabase.from('plans').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updatePlan(id: string, updates: PlanUpdate) {
  const { data, error } = await supabase.from('plans').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePlan(id: string) {
  const { error } = await supabase.from('plans').delete().eq('id', id);
  if (error) throw error;
}
