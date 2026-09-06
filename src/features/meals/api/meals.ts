import { supabase } from '@/lib/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

export async function listMeals(userId: string) {
  const { data, error } = await supabase.from('meals').select('*').eq('user_id', userId).order('name');
  if (error) throw error;
  return data;
}

export async function getMeal(id: string) {
  const { data, error } = await supabase.from('meals').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type MealInsert = TablesInsert<'meals'>;
export type MealUpdate = TablesUpdate<'meals'>;

export async function createMeal(insert: MealInsert) {
  const { data, error } = await supabase.from('meals').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updateMeal(id: string, updates: MealUpdate) {
  const { data, error } = await supabase.from('meals').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMeal(id: string) {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw error;
}
