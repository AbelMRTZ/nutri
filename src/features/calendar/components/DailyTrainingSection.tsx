import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RoutineExerciseCompletionList } from '@/features/calendar/components/RoutineExerciseCompletionList';
import { useCalendarDayRoutineCompletions } from '@/features/calendar/hooks/useCalendarDayRoutineCompletions';
import { useToggleRoutineExerciseCompletion } from '@/features/calendar/hooks/useToggleRoutineExerciseCompletion';
import { useRoutineExercises } from '@/features/routines';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type DailyTrainingSectionProps = {
  routine: Tables<'routines'>;
  calendarDayId: string;
};

/** Exercise checklist + completed-count summary for a day's assigned routine. */
export function DailyTrainingSection({ routine, calendarDayId }: DailyTrainingSectionProps) {
  const theme = useTheme();
  const { data: routineExercises, isLoading } = useRoutineExercises(routine.id);
  const { data: completions } = useCalendarDayRoutineCompletions(calendarDayId);
  const toggleCompletion = useToggleRoutineExerciseCompletion(calendarDayId);

  if (isLoading) {
    return <ActivityIndicator color={theme.primary} />;
  }

  if (!routineExercises || routineExercises.length === 0) {
    return null;
  }

  const completedIds = new Set((completions ?? []).map((completion) => completion.routine_exercise_id));

  return (
    <View style={styles.container}>
      <RoutineExerciseCompletionList
        items={routineExercises}
        completedIds={completedIds}
        onToggle={(routineExerciseId, completed) => toggleCompletion.mutate({ routineExerciseId, completed })}
      />
      <ThemedText type="small" themeColor="textSecondary">
        {completedIds.size} de {routineExercises.length} ejercicios completados
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
