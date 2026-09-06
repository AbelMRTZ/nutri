import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useDeleteFood } from '@/features/foods/hooks/useDeleteFood';
import { foodCategoryLabels, servingTypeLabels } from '@/features/foods/schema';
import { useTheme } from '@/hooks/use-theme';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';
import type { Tables } from '@/lib/supabase/database.types';

export type FoodListItemProps = {
  food: Tables<'foods'>;
  userId: string | undefined;
};

export function FoodListItem({ food, userId }: FoodListItemProps) {
  const theme = useTheme();
  const router = useRouter();
  const deleteFood = useDeleteFood(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleDelete() {
    deleteFood.mutate(food.id, {
      onSuccess: () => setConfirmVisible(false),
      onError: (err) => {
        setError(friendlyDeleteErrorMessage(err, 'Este alimento está en uso en una comida y no se puede eliminar.'));
        setConfirmVisible(false);
      },
    });
  }

  return (
    <View>
      <Pressable
        style={[styles.row, { borderColor: theme.border }]}
        onPress={() => router.push(`/(app)/(tabs)/despensa/alimentos/${food.id}`)}>
        <View style={styles.info}>
          <ThemedText type="smallBold">{food.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {foodCategoryLabels[food.category]} · {servingTypeLabels[food.serving_type]}
          </ThemedText>
        </View>
        <ThemedText type="small" style={{ color: theme.accent }}>
          {food.energy_kcal} kcal
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Eliminar alimento"
          hitSlop={10}
          style={styles.deleteButton}
          onPress={() => setConfirmVisible(true)}>
          <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
        </Pressable>
      </Pressable>

      {error ? (
        <ThemedText type="small" themeColor="danger" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar alimento"
        description={`¿Seguro que quieres eliminar "${food.name}"? Esta acción no se puede deshacer.`}
        loading={deleteFood.isPending}
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
  error: {
    marginTop: -8,
    marginBottom: 8,
  },
});
