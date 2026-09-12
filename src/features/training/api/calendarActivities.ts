import { supabase } from '@/lib/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

export async function listActivitiesForDate(userId: string, date: string) {
  const { data, error } = await supabase
    .from('calendar_activities')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

/** Every date in range with at least one activity — for day-strip indicators. */
export async function listActivityDatesInRange(userId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('calendar_activities')
    .select('date')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);
  if (error) throw error;
  return data;
}

export async function getActivity(id: string) {
  const { data, error } = await supabase.from('calendar_activities').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createActivity(activity: TablesInsert<'calendar_activities'>) {
  const { data, error } = await supabase.from('calendar_activities').insert(activity).select().single();
  if (error) throw error;
  return data;
}

export async function updateActivity(id: string, updates: TablesUpdate<'calendar_activities'>) {
  const { data, error } = await supabase.from('calendar_activities').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteActivity(id: string) {
  const { error } = await supabase.from('calendar_activities').delete().eq('id', id);
  if (error) throw error;
}
