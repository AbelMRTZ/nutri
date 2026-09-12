import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ErrorBanner } from '@/components/error-banner';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { SavedActivityListItem } from '@/features/training/components/SavedActivityListItem';
import { useApplySavedActivity } from '@/features/training/hooks/useApplySavedActivity';
import { useDeleteSavedActivity } from '@/features/training/hooks/useDeleteSavedActivity';
import { useSavedActivities } from '@/features/training/hooks/useSavedActivities';

export type SavedActivityPickerScreenProps = {
  date: string;
};

export function SavedActivityPickerScreen({ date }: SavedActivityPickerScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: profile } = useProfile(userId);
  const { data: templates, isLoading } = useSavedActivities(userId);
  const applyTemplate = useApplySavedActivity(userId);
  const deleteTemplate = useDeleteSavedActivity(userId);
  const [error, setError] = useState<string | undefined>();
  const [applyingId, setApplyingId] = useState<string | undefined>();

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  function handleApply(template: NonNullable<typeof templates>[number]) {
    setError(undefined);
    setApplyingId(template.id);
    applyTemplate.mutate(
      { template, date, weightKg: profile?.weight_kg ?? null },
      {
        onSuccess: () => router.back(),
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'No se ha podido aplicar el entreno guardado.');
          setApplyingId(undefined);
        },
      },
    );
  }

  return (
    <View style={styles.root}>
      <Screen padded={false}>
        {!templates || templates.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
            Todavía no has guardado ningún entreno. Márcalo al crear una actividad para que aparezca aquí.
          </ThemedText>
        ) : (
          <FlatList
            data={templates}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <SavedActivityListItem
                template={item}
                applying={applyingId === item.id}
                deleting={deleteTemplate.isPending && deleteTemplate.variables === item.id}
                onApply={() => handleApply(item)}
                onDelete={() => deleteTemplate.mutate(item.id)}
              />
            )}
          />
        )}
      </Screen>
      {error ? <ErrorBanner message={error} onDismiss={() => setError(undefined)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});
