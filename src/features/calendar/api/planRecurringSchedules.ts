import { supabase } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/supabase/database.types';

export async function getActiveScheduleForPlan(planId: string) {
  const { data, error } = await supabase
    .from('plan_recurring_schedules')
    .select('*')
    .eq('plan_id', planId)
    .eq('active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** All still-active schedules for a user — the top-up sweep iterates these. */
export async function listActiveSchedules(userId: string) {
  const { data, error } = await supabase
    .from('plan_recurring_schedules')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true);
  if (error) throw error;
  return data;
}

export async function createRecurringSchedule(schedule: TablesInsert<'plan_recurring_schedules'>) {
  const { data, error } = await supabase.from('plan_recurring_schedules').insert(schedule).select().single();
  if (error) throw error;
  return data;
}

export async function deactivateRecurringSchedule(id: string) {
  const { error } = await supabase.from('plan_recurring_schedules').update({ active: false }).eq('id', id);
  if (error) throw error;
}

/** Latest date already materialized by a schedule — the top-up sweep resumes the day after this. */
export async function getLatestScheduledDate(scheduleId: string) {
  const { data, error } = await supabase
    .from('calendar_days')
    .select('date')
    .eq('plan_schedule_id', scheduleId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.date ?? null;
}

/** Clears today-onward calendar_days rows a schedule created — called when disabling it. */
export async function deleteFutureScheduledDays(scheduleId: string, fromDate: string) {
  const { error } = await supabase.from('calendar_days').delete().eq('plan_schedule_id', scheduleId).gte('date', fromDate);
  if (error) throw error;
}
