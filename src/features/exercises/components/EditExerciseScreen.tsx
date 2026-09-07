import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { ExerciseForm } from '@/features/exercises/components/ExerciseForm';
import { useDeleteExercise } from '@/features/exercises/hooks/useDeleteExercise';
import { useExercise } from '@/features/exercises/hooks/useExercise';
import { useUpdateExercise } from '@/features/exercises/hooks/useUpdateExercise';
import { toFormDefaults } from '@/features/exercises/mappers';
import type { ExerciseFormValues } from '@/features/exercises/schema';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';

export type EditExerciseScreenProps = {
  id: string;
};

export function EditExerciseScreen({ id }: EditExerciseScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: exercise, isLoading } = useExercise(id);
  const updateExercise = useUpdateExercise(id, userId);
  const deleteExercise = useDeleteExercise(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();

  if (isLoading || !exercise) {
    return <FullScreenSpinner />;
  }

  function handleSubmit(values: ExerciseFormValues) {
    updateExercise.mutate(values, {
      onSuccess: () => router.back(),
    });
  }

  function handleDelete() {
    deleteExercise.mutate(id, {
      onSuccess: () => router.back(),
      onError: (error) => {
        setDeleteError(friendlyDeleteErrorMessage(error, 'Este ejercicio está en uso en una rutina y no se puede eliminar.'));
        setConfirmVisible(false);
      },
    });
  }

  return (
    <Screen scroll>
      <ExerciseForm
        defaultValues={toFormDefaults(exercise)}
        onSubmit={handleSubmit}
        submitting={updateExercise.isPending}
        submitLabel="Guardar cambios"
        footer={
          <>
            {deleteError ? (
              <ThemedText type="small" themeColor="danger">
                {deleteError}
              </ThemedText>
            ) : null}
            <Button variant="ghost" title="Eliminar ejercicio" onPress={() => setConfirmVisible(true)} />
          </>
        }
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar ejercicio"
        description={`¿Seguro que quieres eliminar "${exercise.name}"? Esta acción no se puede deshacer.`}
        loading={deleteExercise.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </Screen>
  );
}
