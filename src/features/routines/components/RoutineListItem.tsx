import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useDeleteRoutine } from '@/features/routines/hooks/useDeleteRoutine';
import { useTheme } from '@/hooks/use-theme';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';
import type { Tables } from '@/lib/supabase/database.types';

export type RoutineListItemProps = {
  routine: Tables<'routines'>;
  userId: string | undefined;
};

export function RoutineListItem({ routine, userId }: RoutineListItemProps) {
  const theme = useTheme();
  const router = useRouter();
  const deleteRoutine = useDeleteRoutine(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleDelete() {
    deleteRoutine.mutate(routine.id, {
      onSuccess: () => setConfirmVisible(false),
      onError: (err) => {
        setError(friendlyDeleteErrorMessage(err, 'Esta rutina está en uso y no se puede eliminar.'));
        setConfirmVisible(false);
      },
    });
  }

  return (
    <View>
      <Pressable
        style={[styles.row, { borderColor: theme.border }]}
        onPress={() => router.push(`/(app)/(tabs)/entrenamiento/rutinas/${routine.id}`)}>
        <View style={styles.info}>
          <ThemedText type="smallBold">{routine.name}</ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Eliminar rutina"
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
        title="Eliminar rutina"
        description={`¿Seguro que quieres eliminar "${routine.name}"? Esta acción no se puede deshacer.`}
        loading={deleteRoutine.isPending}
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
