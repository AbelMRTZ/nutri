import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { RoutineListItem } from '@/features/routines/components/RoutineListItem';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import { useTheme } from '@/hooks/use-theme';

export function RoutinesListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: routines, isLoading } = useRoutines(userId);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (!routines || routines.length === 0) {
    return (
      <Screen style={styles.emptyContainer}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.primary }]}>
          <Ionicons name="body-outline" size={32} color={theme.accentSecondary} />
        </View>
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          Todavía no hay rutinas
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.emptyDescription}>
          Añade una para poder visualizarla aquí.
        </ThemedText>
        <Button title="Añadir rutina" onPress={() => router.push('/(app)/(tabs)/entrenamiento/rutinas/nueva')} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <RoutineListItem routine={item} userId={userId} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});
