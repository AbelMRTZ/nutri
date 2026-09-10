import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useDeleteMeal } from '@/features/meals/hooks/useDeleteMeal';
import { mealCategoryLabels } from '@/features/meals/schema';
import { useTheme } from '@/hooks/use-theme';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';
import type { Tables } from '@/lib/supabase/database.types';

export type MealListItemProps = {
  meal: Tables<'meals'>;
  userId: string | undefined;
  onDeleteError: (message: string) => void;
};

export function MealListItem({ meal, userId, onDeleteError }: MealListItemProps) {
  const theme = useTheme();
  const router = useRouter();
  const deleteMeal = useDeleteMeal(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);

  function handleDelete() {
    deleteMeal.mutate(meal.id, {
      onSuccess: () => setConfirmVisible(false),
      onError: (err) => {
        onDeleteError(friendlyDeleteErrorMessage(err, 'Esta comida está en uso en un plan y no se puede eliminar.'));
        setConfirmVisible(false);
      },
    });
  }

  return (
    <View>
      <Pressable
        style={[styles.row, { borderColor: theme.border }]}
        onPress={() => router.push(`/(app)/(tabs)/despensa/comidas/${meal.id}`)}>
        <View style={styles.info}>
          <ThemedText type="smallBold">{meal.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {mealCategoryLabels[meal.category]}
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Eliminar comida"
          hitSlop={10}
          style={styles.deleteButton}
          onPress={() => setConfirmVisible(true)}>
          <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
        </Pressable>
      </Pressable>

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar comida"
        description={`¿Seguro que quieres eliminar "${meal.name}"? Esta acción no se puede deshacer.`}
        loading={deleteMeal.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  deleteButton: {
    padding: 4,
  },
});
