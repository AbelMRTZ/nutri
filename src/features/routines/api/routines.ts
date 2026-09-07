import { supabase } from '@/lib/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

export async function listRoutines(userId: string) {
  const { data, error } = await supabase.from('routines').select('*').eq('user_id', userId).order('name');
  if (error) throw error;
  return data;
}

export async function getRoutine(id: string) {
  const { data, error } = await supabase.from('routines').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type RoutineInsert = TablesInsert<'routines'>;
export type RoutineUpdate = TablesUpdate<'routines'>;

export async function createRoutine(insert: RoutineInsert) {
  const { data, error } = await supabase.from('routines').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updateRoutine(id: string, updates: RoutineUpdate) {
  const { data, error } = await supabase.from('routines').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRoutine(id: string) {
  const { error } = await supabase.from('routines').delete().eq('id', id);
  if (error) throw error;
}
