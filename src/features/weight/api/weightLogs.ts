import { supabase } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/supabase/database.types';

export async function listWeightLogs(userId: string) {
  const { data, error } = await supabase.from('weight_logs').select('*').eq('user_id', userId).order('date');
  if (error) throw error;
  return data;
}

export type WeightLogUpsert = TablesInsert<'weight_logs'>;

/** One row per (user, date) — registering/editing a day's weight upserts on that unique key rather than checking for an existing row first. */
export async function upsertWeightLog(upsert: WeightLogUpsert) {
  const { data, error } = await supabase
    .from('weight_logs')
    .upsert(upsert, { onConflict: 'user_id,date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWeightLog(id: string) {
  const { error } = await supabase.from('weight_logs').delete().eq('id', id);
  if (error) throw error;
}
