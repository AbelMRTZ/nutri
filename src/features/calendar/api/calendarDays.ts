import { supabase } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/supabase/database.types';

export async function getCalendarDay(userId: string, date: string) {
  const { data, error } = await supabase
    .from('calendar_days')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCalendarDaysInRange(userId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('calendar_days')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);
  if (error) throw error;
  return data;
}

export type CalendarDayUpsert = TablesInsert<'calendar_days'>;

/** One row per (user, date) — assigning/freeing a day upserts on that unique key rather than checking for an existing row first. */
export async function upsertCalendarDay(upsert: CalendarDayUpsert) {
  const { data, error } = await supabase
    .from('calendar_days')
    .upsert(upsert, { onConflict: 'user_id,date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCalendarDay(id: string) {
  const { error } = await supabase.from('calendar_days').delete().eq('id', id);
  if (error) throw error;
}
