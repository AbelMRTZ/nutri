import { supabase } from '@/lib/supabase/client';

export async function listCompletionsForDay(calendarDayId: string) {
  const { data, error } = await supabase
    .from('plan_item_completions')
    .select('*')
    .eq('calendar_day_id', calendarDayId);
  if (error) throw error;
  return data;
}

export async function markMealCompleted(calendarDayId: string, planItemId: string) {
  const { error } = await supabase
    .from('plan_item_completions')
    .insert({ calendar_day_id: calendarDayId, plan_item_id: planItemId });
  if (error) throw error;
}

export async function unmarkMealCompleted(calendarDayId: string, planItemId: string) {
  const { error } = await supabase
    .from('plan_item_completions')
    .delete()
    .eq('calendar_day_id', calendarDayId)
    .eq('plan_item_id', planItemId);
  if (error) throw error;
}
