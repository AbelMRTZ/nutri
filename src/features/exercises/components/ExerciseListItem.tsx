import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useDeleteExercise } from '@/features/exercises/hooks/useDeleteExercise';
import { equipmentLabels, muscleGroupLabels } from '@/features/exercises/schema';
import { useTheme } from '@/hooks/use-theme';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';
import type { Tables } from '@/lib/supabase/database.types';

export type ExerciseListItemProps = {
  exercise: Tables<'exercises'>;
  userId: string | undefined;
};

export function ExerciseListItem({ exercise, userId }: ExerciseListItemProps) {
  const theme = useTheme();
  const router = useRouter();
  const deleteExercise = useDeleteExercise(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleDelete() {
    deleteExercise.mutate(exercise.id, {
      onSuccess: () => setConfirmVisible(false),
      onError: (err) => {
        setError(friendlyDeleteErrorMessage(err, 'Este ejercicio está en uso en una rutina y no se puede eliminar.'));
        setConfirmVisible(false);
      },
    });
  }

  return (
    <View>
      <Pressable
        style={[styles.row, { borderColor: theme.border }]}
        onPress={() => router.push(`/(app)/(tabs)/entrenamiento/ejercicios/${exercise.id}`)}>
        <View style={styles.info}>
          <ThemedText type="smallBold">{exercise.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {muscleGroupLabels[exercise.muscle_group]} · {equipmentLabels[exercise.equipment]}
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Eliminar ejercicio"
          hitSlop={10}
          style={styles.deleteButton}
          onPress={() => setConfirmVisible(true)}>
          <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
        </Pressable>
      </Pressable>

      {error ? (
        <ThemedText type="small" themeColor="danger" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar ejercicio"
        description={`¿Seguro que quieres eliminar "${exercise.name}"? Esta acción no se puede deshacer.`}
        loading={deleteExercise.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
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
  deleteButton: {
    padding: 4,
  },
  error: {
    marginTop: -8,
    marginBottom: 8,
  },
});
