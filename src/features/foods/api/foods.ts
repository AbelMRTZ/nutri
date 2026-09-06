import { supabase } from '@/lib/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

export async function listFoods(userId: string) {
  const { data, error } = await supabase.from('foods').select('*').eq('user_id', userId).order('name');
  if (error) throw error;
  return data;
}

export async function getFood(id: string) {
  const { data, error } = await supabase.from('foods').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type FoodInsert = TablesInsert<'foods'>;
export type FoodUpdate = TablesUpdate<'foods'>;

export async function createFood(insert: FoodInsert) {
  const { data, error } = await supabase.from('foods').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updateFood(id: string, updates: FoodUpdate) {
  const { data, error } = await supabase.from('foods').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteFood(id: string) {
  const { error } = await supabase.from('foods').delete().eq('id', id);
  if (error) throw error;
}
