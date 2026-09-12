import { useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ActivityRow } from '@/features/training/components/ActivityRow';
import { useDayActivities } from '@/features/training/hooks/useDayActivities';
import { useTheme } from '@/hooks/use-theme';

export type ActivitiesDaySummaryProps = {
  userId: string | undefined;
  date: string;
};

/**
 * Read-only summary shown on the nutrition Calendario's day panel — no
 * edit/delete here, tapping anything just routes to the Entrenamiento tab
 * (the actual management page) for this date.
 */
export function ActivitiesDaySummary({ userId, date }: ActivitiesDaySummaryProps) {
  const theme = useTheme();
  const router = useRouter();
  const { data: activities, isLoading } = useDayActivities(userId, date);

  function goToTraining() {
    router.push({ pathname: '/(app)/(tabs)/entrenamiento', params: { date } });
  }

  if (isLoading) {
    return <ActivityIndicator color={theme.primary} />;
  }

  const total = (activities ?? []).reduce((sum, activity) => sum + activity.calories_burned, 0);

  return (
    <View style={styles.container}>
      {!activities || activities.length === 0 ? (
        <ThemedText type="default" themeColor="textSecondary">
          Todavía no has registrado actividad física este día.
        </ThemedText>
      ) : (
        <View>
          {activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} onPress={goToTraining} />
          ))}
          <ThemedText type="smallBold" style={styles.total}>
            Quemado hoy: {total} kcal
          </ThemedText>
        </View>
      )}
      <Button variant="secondary" title="Gestionar entrenamiento" onPress={goToTraining} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  total: {
    marginTop: 8,
    textAlign: 'right',
  },
});
