import { supabase } from '@/lib/supabase/client';

export async function listRoutineCompletionsForDay(calendarDayId: string) {
  const { data, error } = await supabase
    .from('routine_exercise_completions')
    .select('*')
    .eq('calendar_day_id', calendarDayId);
  if (error) throw error;
  return data;
}

export async function markRoutineExerciseCompleted(calendarDayId: string, routineExerciseId: string) {
  const { error } = await supabase
    .from('routine_exercise_completions')
    .insert({ calendar_day_id: calendarDayId, routine_exercise_id: routineExerciseId });
  if (error) throw error;
}

export async function unmarkRoutineExerciseCompleted(calendarDayId: string, routineExerciseId: string) {
  const { error } = await supabase
    .from('routine_exercise_completions')
    .delete()
    .eq('calendar_day_id', calendarDayId)
    .eq('routine_exercise_id', routineExerciseId);
  if (error) throw error;
}
