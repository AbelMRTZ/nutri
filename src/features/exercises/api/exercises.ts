import { supabase } from '@/lib/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

export async function listExercises(userId: string) {
  const { data, error } = await supabase.from('exercises').select('*').eq('user_id', userId).order('name');
  if (error) throw error;
  return data;
}

export async function getExercise(id: string) {
  const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type ExerciseInsert = TablesInsert<'exercises'>;
export type ExerciseUpdate = TablesUpdate<'exercises'>;

export async function createExercise(insert: ExerciseInsert) {
  const { data, error } = await supabase.from('exercises').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updateExercise(id: string, updates: ExerciseUpdate) {
  const { data, error } = await supabase.from('exercises').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteExercise(id: string) {
  const { error } = await supabase.from('exercises').delete().eq('id', id);
  if (error) throw error;
}
