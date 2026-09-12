import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { ActivityRow } from '@/features/training/components/ActivityRow';
import { useDayActivities } from '@/features/training/hooks/useDayActivities';
import { useDeleteActivity } from '@/features/training/hooks/useDeleteActivity';
import { useTheme } from '@/hooks/use-theme';
import { formatDisplayDate, fromDateKey } from '@/lib/dates';

export type TrainingDayPanelProps = {
  dateKey: string;
  userId: string | undefined;
};

export function TrainingDayPanel({ dateKey, userId }: TrainingDayPanelProps) {
  const theme = useTheme();
  const router = useRouter();
  const { data: activities, isLoading } = useDayActivities(userId, dateKey);
  const deleteActivity = useDeleteActivity(userId, dateKey);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const total = (activities ?? []).reduce((sum, activity) => sum + activity.calories_burned, 0);

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{formatDisplayDate(fromDateKey(dateKey))}</ThemedText>

      {isLoading ? (
        <ActivityIndicator color={theme.primary} />
      ) : !activities || activities.length === 0 ? (
        <ThemedText type="default" themeColor="textSecondary">
          Todavía no has añadido ninguna actividad este día.
        </ThemedText>
      ) : (
        <View>
          {activities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              onPress={() => router.push(`/(app)/(tabs)/entrenamiento/actividad/${activity.id}`)}
              onDelete={() => setPendingDeleteId(activity.id)}
            />
          ))}
          <ThemedText type="smallBold" style={styles.total}>
            Quemado hoy: {total} kcal
          </ThemedText>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Añadir actividad"
          onPress={() => router.push({ pathname: '/(app)/(tabs)/entrenamiento/nueva-actividad', params: { date: dateKey } })}
        />
        <Button
          variant="secondary"
          title="Mis entrenos guardados"
          onPress={() => router.push({ pathname: '/(app)/(tabs)/entrenamiento/guardados', params: { date: dateKey } })}
        />
      </View>

      <ConfirmDialog
        visible={pendingDeleteId !== null}
        title="Eliminar actividad"
        description="¿Seguro que quieres eliminar esta actividad? Esta acción no se puede deshacer."
        loading={deleteActivity.isPending}
        onConfirm={() => {
          if (!pendingDeleteId) return;
          deleteActivity.mutate(pendingDeleteId, { onSuccess: () => setPendingDeleteId(null) });
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  total: {
    marginTop: 12,
    textAlign: 'right',
  },
  actions: {
    gap: 12,
  },
});
