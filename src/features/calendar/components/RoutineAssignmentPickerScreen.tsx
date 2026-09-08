import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAssignRoutineToDay } from '@/features/calendar/hooks/useAssignRoutineToDay';
import { RoutinePickerListItem } from '@/features/calendar/components/RoutinePickerListItem';
import { useAuth } from '@/features/auth';
import { useRoutines } from '@/features/routines';

export type RoutineAssignmentPickerScreenProps = {
  date: string;
};

export function RoutineAssignmentPickerScreen({ date }: RoutineAssignmentPickerScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: routines, isLoading } = useRoutines(userId);
  const assignRoutineToDay = useAssignRoutineToDay(userId);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  function handlePick(routineId: string) {
    assignRoutineToDay.mutate({ date, routineId }, { onSuccess: () => router.back() });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      {!routines || routines.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          Todavía no hay rutinas. Crea una en Entrenamiento → Rutinas.
        </ThemedText>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <RoutinePickerListItem routine={item} onPress={() => handlePick(item.id)} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 8,
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
