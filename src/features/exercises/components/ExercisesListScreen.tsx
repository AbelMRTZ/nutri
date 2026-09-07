import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { ExerciseListItem } from '@/features/exercises/components/ExerciseListItem';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { useTheme } from '@/hooks/use-theme';

export function ExercisesListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: exercises, isLoading } = useExercises(userId);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Screen style={styles.emptyContainer}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.primary }]}>
          <Ionicons name="barbell-outline" size={32} color={theme.accentSecondary} />
        </View>
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          Todavía no hay ejercicios
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.emptyDescription}>
          Añade uno para poder visualizarlo aquí.
        </ThemedText>
        <Button title="Añadir ejercicio" onPress={() => router.push('/(app)/(tabs)/entrenamiento/ejercicios/nuevo')} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ExerciseListItem exercise={item} userId={userId} />}
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
