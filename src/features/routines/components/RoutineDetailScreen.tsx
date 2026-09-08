import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import type { RoutineExerciseWithExercise } from '@/features/routines/api/routineExercises';
import { RoutineExerciseRow } from '@/features/routines/components/RoutineExerciseRow';
import { RoutineForm } from '@/features/routines/components/RoutineForm';
import { useDeleteRoutine } from '@/features/routines/hooks/useDeleteRoutine';
import { useReorderRoutineExercises } from '@/features/routines/hooks/useReorderRoutineExercises';
import { useRoutine } from '@/features/routines/hooks/useRoutine';
import { useRoutineExercises } from '@/features/routines/hooks/useRoutineExercises';
import { useUpdateRoutine } from '@/features/routines/hooks/useUpdateRoutine';
import { toFormDefaults } from '@/features/routines/mappers';
import type { RoutineFormValues } from '@/features/routines/schema';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';

export type RoutineDetailScreenProps = {
  id: string;
};

function swap<T>(list: T[], index: number, otherIndex: number): T[] {
  const next = [...list];
  [next[index], next[otherIndex]] = [next[otherIndex], next[index]];
  return next;
}

export function RoutineDetailScreen({ id }: RoutineDetailScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: routine, isLoading } = useRoutine(id);
  const { data: routineExercises } = useRoutineExercises(id);
  const updateRoutine = useUpdateRoutine(id, userId);
  const deleteRoutine = useDeleteRoutine(userId);
  const reorderRoutineExercises = useReorderRoutineExercises(id);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  // Only holds a value while a reorder is in flight — cleared once the
  // mutation settles so the server's own (now-matching) order takes back
  // over, instead of an effect syncing local state from the query on every
  // change.
  const [pendingOrder, setPendingOrder] = useState<RoutineExerciseWithExercise[] | null>(null);
  const orderedItems = pendingOrder ?? routineExercises ?? [];

  if (isLoading || !routine) {
    return <FullScreenSpinner />;
  }

  function handleSubmit(values: RoutineFormValues) {
    updateRoutine.mutate(values);
  }

  function handleDelete() {
    deleteRoutine.mutate(id, {
      onSuccess: () => router.back(),
      onError: (error) => {
        setDeleteError(friendlyDeleteErrorMessage(error, 'Esta rutina está asignada a un día del calendario y no se puede eliminar.'));
        setConfirmVisible(false);
      },
    });
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedItems.length) return;

    const reordered = swap(orderedItems, index, nextIndex);
    setPendingOrder(reordered);
    reorderRoutineExercises.mutate(
      reordered.map((item, i) => ({ id: item.id, sort_order: i })),
      { onSettled: () => setPendingOrder(null) },
    );
  }

  return (
    <Screen scroll style={styles.content}>
      <RoutineForm
        defaultValues={toFormDefaults(routine)}
        onSubmit={handleSubmit}
        submitting={updateRoutine.isPending}
        submitLabel="Guardar cambios"
      />

      <View style={styles.itemsSection}>
        <View style={styles.itemsHeader}>
          <ThemedText type="smallBold">Ejercicios</ThemedText>
          <Button
            variant="secondary"
            title="Añadir ejercicio"
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/entrenamiento/rutinas/agregar-ejercicio',
                params: { routineId: id },
              })
            }
          />
        </View>

        {orderedItems.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            Todavía no has añadido ningún ejercicio.
          </ThemedText>
        ) : (
          <View style={styles.itemsList}>
            {orderedItems.map((item, index) => (
              <RoutineExerciseRow
                key={item.id}
                item={item}
                routineId={id}
                canMoveUp={index > 0}
                canMoveDown={index < orderedItems.length - 1}
                onMoveUp={() => moveItem(index, -1)}
                onMoveDown={() => moveItem(index, 1)}
              />
            ))}
          </View>
        )}
      </View>

      {deleteError ? (
        <ThemedText type="small" themeColor="danger">
          {deleteError}
        </ThemedText>
      ) : null}
      <Button variant="ghost" title="Eliminar rutina" onPress={() => setConfirmVisible(true)} />

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar rutina"
        description={`¿Seguro que quieres eliminar "${routine.name}"? Esta acción no se puede deshacer.`}
        loading={deleteRoutine.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  itemsSection: {
    gap: 8,
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemsList: {
    gap: 12,
  },
});
