import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { equipmentLabels, muscleGroupLabels } from '@/features/exercises';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type ExercisePickerListItemProps = {
  exercise: Tables<'exercises'>;
  onPress: () => void;
};

export function ExercisePickerListItem({ exercise, onPress }: ExercisePickerListItemProps) {
  const theme = useTheme();

  return (
    <Pressable style={[styles.row, { borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{exercise.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {muscleGroupLabels[exercise.muscle_group]} · {equipmentLabels[exercise.equipment]}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
