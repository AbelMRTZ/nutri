import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { RoutineExerciseWithExercise } from '@/features/routines';
import { useTheme } from '@/hooks/use-theme';

export type RoutineExerciseCompletionListProps = {
  items: RoutineExerciseWithExercise[];
  completedIds: Set<string>;
  onToggle: (routineExerciseId: string, completed: boolean) => void;
};

/** Checklist of a day's routine exercises — toggling one marks it done/not done. */
export function RoutineExerciseCompletionList({ items, completedIds, onToggle }: RoutineExerciseCompletionListProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const completed = completedIds.has(item.id);
        const weightLabel = item.weight_kg ? ` @ ${item.weight_kg} kg` : '';

        return (
          <Pressable
            key={item.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed }}
            style={[styles.row, { borderColor: theme.border }]}
            onPress={() => onToggle(item.id, !completed)}>
            <View
              style={[
                styles.checkbox,
                { borderColor: theme.border, backgroundColor: completed ? theme.accentSecondary : 'transparent' },
              ]}>
              {completed ? <Ionicons name="checkmark" size={14} color={theme.text} /> : null}
            </View>
            <View style={styles.info}>
              <ThemedText type="smallBold" style={completed && styles.strikethrough}>
                {item.exercise.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.sets} x {item.reps}
                {weightLabel}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
});
