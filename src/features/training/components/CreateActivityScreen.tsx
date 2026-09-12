import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorBanner } from '@/components/error-banner';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { ActivityForm } from '@/features/training/components/ActivityForm';
import { useCreateActivity } from '@/features/training/hooks/useCreateActivity';
import { useCreateSavedActivity } from '@/features/training/hooks/useCreateSavedActivity';
import { buildActivityInsert, buildSavedActivityInsert, resolveActivityCalories } from '@/features/training/mappers';
import type { ActivityFormValues } from '@/features/training/schema';

export type CreateActivityScreenProps = {
  date: string;
};

export function CreateActivityScreen({ date }: CreateActivityScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: profile } = useProfile(userId);
  const createActivity = useCreateActivity(userId);
  const createSavedActivity = useCreateSavedActivity(userId);
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(values: ActivityFormValues) {
    if (!userId) return;
    setError(undefined);
    try {
      const resolved = resolveActivityCalories(values, profile?.weight_kg ?? null);
      const insert = buildActivityInsert(values, { userId, date }, resolved);
      createActivity.mutate(insert, {
        onSuccess: () => {
          if (values.save_as_template) {
            createSavedActivity.mutate(buildSavedActivityInsert(values, { userId }, resolved));
          }
          router.back();
        },
        onError: () => setError('No se ha podido guardar la actividad. Inténtalo de nuevo.'),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido calcular el gasto de esta actividad.');
    }
  }

  return (
    <View style={styles.root}>
      <Screen scroll>
        <ActivityForm
          defaultValues={{}}
          userId={userId}
          onSubmit={handleSubmit}
          submitLabel="Añadir actividad"
          submitting={createActivity.isPending}
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
