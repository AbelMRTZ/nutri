import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorBanner } from '@/components/error-banner';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { MealListItem } from '@/features/meals/components/MealListItem';
import { useMeals } from '@/features/meals/hooks/useMeals';
import { useTheme } from '@/hooks/use-theme';

export function MealsListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: meals, isLoading } = useMeals(userId);
  const [deleteError, setDeleteError] = useState<string | undefined>();

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (!meals || meals.length === 0) {
    return (
      <Screen style={styles.emptyContainer}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.primary }]}>
          <Ionicons name="restaurant-outline" size={32} color={theme.accentSecondary} />
        </View>
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          Todavía no hay comidas
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.emptyDescription}>
          Añade una para poder visualizarla aquí.
        </ThemedText>
        <Button title="Añadir comida" onPress={() => router.push('/(app)/(tabs)/despensa/comidas/nueva')} />
      </Screen>
    );
  }

  return (
    <View style={styles.root}>
      <Screen padded={false}>
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MealListItem meal={item} userId={userId} onDeleteError={setDeleteError} />}
        />
      </Screen>

      {deleteError ? <ErrorBanner message={deleteError} onDismiss={() => setDeleteError(undefined)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
