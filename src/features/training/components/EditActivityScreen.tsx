import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ErrorBanner } from '@/components/error-banner';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { ActivityForm } from '@/features/training/components/ActivityForm';
import { useActivity } from '@/features/training/hooks/useActivity';
import { useCreateSavedActivity } from '@/features/training/hooks/useCreateSavedActivity';
import { useDeleteActivity } from '@/features/training/hooks/useDeleteActivity';
import { useUpdateActivity } from '@/features/training/hooks/useUpdateActivity';
import { buildActivityInsert, buildSavedActivityInsert, resolveActivityCalories, toFormDefaults } from '@/features/training/mappers';
import type { ActivityFormValues } from '@/features/training/schema';

export type EditActivityScreenProps = {
  id: string;
};

export function EditActivityScreen({ id }: EditActivityScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: activity, isLoading } = useActivity(id);
  const { data: profile } = useProfile(userId);
  const updateActivity = useUpdateActivity(id, userId);
  const deleteActivity = useDeleteActivity(userId, activity?.date);
  const createSavedActivity = useCreateSavedActivity(userId);
  const [error, setError] = useState<string | undefined>();
  const [confirmVisible, setConfirmVisible] = useState(false);

  if (isLoading || !activity) {
    return <FullScreenSpinner />;
  }

  function handleSubmit(values: ActivityFormValues) {
    if (!userId || !activity) return;
    setError(undefined);
    try {
      const resolved = resolveActivityCalories(values, profile?.weight_kg ?? null);
      const insert = buildActivityInsert(values, { userId, date: activity.date }, resolved);
      updateActivity.mutate(insert, {
        onSuccess: () => {
          if (values.save_as_template) {
            createSavedActivity.mutate(buildSavedActivityInsert(values, { userId }, resolved));
          }
          router.back();
        },
        onError: () => setError('No se han podido guardar los cambios. Inténtalo de nuevo.'),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido calcular el gasto de esta actividad.');
    }
  }

  function handleDelete() {
    deleteActivity.mutate(id, {
      onSuccess: () => router.back(),
      onError: () => {
        setError('No se ha podido eliminar la actividad. Inténtalo de nuevo.');
        setConfirmVisible(false);
      },
    });
  }

  return (
    <View style={styles.root}>
      <Screen scroll>
        <ActivityForm
          defaultValues={toFormDefaults(activity)}
          userId={userId}
          onSubmit={handleSubmit}
          submitLabel="Guardar cambios"
          submitting={updateActivity.isPending}
          footer={<Button variant="ghost" title="Eliminar actividad" onPress={() => setConfirmVisible(true)} />}
        />

        <ConfirmDialog
          visible={confirmVisible}
          title="Eliminar actividad"
          description="¿Seguro que quieres eliminar esta actividad? Esta acción no se puede deshacer."
          loading={deleteActivity.isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirmVisible(false)}
        />
      </Screen>
      {error ? <ErrorBanner message={error} onDismiss={() => setError(undefined)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
