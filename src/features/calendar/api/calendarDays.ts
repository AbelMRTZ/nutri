import { supabase } from '@/lib/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/database.types';

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

/** Bulk version of upsertCalendarDay — used to apply a plan to many dates at once (schedule/repeat). */
export async function upsertCalendarDays(rows: CalendarDayUpsert[]) {
  if (rows.length === 0) return [];
  const { data, error } = await supabase.from('calendar_days').upsert(rows, { onConflict: 'user_id,date' }).select();
  if (error) throw error;
  return data;
}

/**
 * Clears one or more fields on a calendar day (e.g. un-assigning a plan or a
 * routine, un-marking free) — an update, never a row delete, because
 * plan/free-day state and routine assignment are independent and can share
 * the same row: removing one must not silently wipe the other.
 */
export async function updateCalendarDay(id: string, updates: TablesUpdate<'calendar_days'>) {
  const { error } = await supabase.from('calendar_days').update(updates).eq('id', id);
  if (error) throw error;
}
