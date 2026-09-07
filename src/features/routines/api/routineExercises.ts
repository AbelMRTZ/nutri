import { supabase } from '@/lib/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

export type RoutineExerciseWithExercise = Tables<'routine_exercises'> & { exercise: Tables<'exercises'> };

export async function listRoutineExercises(routineId: string): Promise<RoutineExerciseWithExercise[]> {
  const { data, error } = await supabase
    .from('routine_exercises')
    .select('*, exercise:exercises(*)')
    .eq('routine_id', routineId)
    .order('sort_order');
  if (error) throw error;
  return data as unknown as RoutineExerciseWithExercise[];
}

export type RoutineExerciseInsert = TablesInsert<'routine_exercises'>;
export type RoutineExerciseUpdate = TablesUpdate<'routine_exercises'>;

export async function createRoutineExercise(insert: RoutineExerciseInsert): Promise<RoutineExerciseWithExercise> {
  const { data, error } = await supabase
    .from('routine_exercises')
    .insert(insert)
    .select('*, exercise:exercises(*)')
    .single();
  if (error) throw error;
  return data as unknown as RoutineExerciseWithExercise;
}

export async function updateRoutineExercise(id: string, updates: RoutineExerciseUpdate) {
  const { error } = await supabase.from('routine_exercises').update(updates).eq('id', id);
  if (error) throw error;
}

export async function updateRoutineExerciseSortOrder(id: string, sortOrder: number) {
  const { error } = await supabase.from('routine_exercises').update({ sort_order: sortOrder }).eq('id', id);
  if (error) throw error;
}

export async function deleteRoutineExercise(id: string) {
  const { error } = await supabase.from('routine_exercises').delete().eq('id', id);
  if (error) throw error;
}
