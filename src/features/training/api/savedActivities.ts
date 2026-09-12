import { supabase } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/supabase/database.types';

export async function listSavedActivities(userId: string) {
  const { data, error } = await supabase.from('saved_activities').select('*').eq('user_id', userId).order('name');
  if (error) throw error;
  return data;
}

export async function getSavedActivity(id: string) {
  const { data, error } = await supabase.from('saved_activities').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createSavedActivity(activity: TablesInsert<'saved_activities'>) {
  const { data, error } = await supabase.from('saved_activities').insert(activity).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSavedActivity(id: string) {
  const { error } = await supabase.from('saved_activities').delete().eq('id', id);
  if (error) throw error;
}
