import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { calculateFoodContribution, servingTypeLabels } from '@/features/foods';
import type { MealItemWithFood } from '@/features/meals/api/mealItems';
import { useDeleteMealItem } from '@/features/meals/hooks/useDeleteMealItem';
import { mealItemFlexibilityLabels } from '@/features/meals/schema';
import { useTheme } from '@/hooks/use-theme';

export type MealItemRowProps = {
  item: MealItemWithFood;
  mealId: string;
};

export function MealItemRow({ item, mealId }: MealItemRowProps) {
  const theme = useTheme();
  const deleteMealItem = useDeleteMealItem(mealId);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const contribution = calculateFoodContribution(item.food, item.quantity);
  const unit = item.food.serving_type === 'per_unit' ? 'unidades' : 'g';
  const flexibility = mealItemFlexibilityLabels[item.is_variable ? 'variable' : 'invariable'];

  return (
    <View style={[styles.row, { borderColor: theme.border }]}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{item.food.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {item.quantity} {unit} · {contribution.energy_kcal} kcal · {flexibility}
        </ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quitar alimento"
        hitSlop={10}
        onPress={() => setConfirmVisible(true)}>
        <Ionicons name="close-circle-outline" size={20} color={theme.textSecondary} />
      </Pressable>

      <ConfirmDialog
        visible={confirmVisible}
        title="Quitar alimento"
        description={`¿Quitar "${item.food.name}" (${servingTypeLabels[item.food.serving_type]}) de esta comida?`}
        confirmLabel="Quitar"
        loading={deleteMealItem.isPending}
        onConfirm={() => deleteMealItem.mutate(item.id, { onSuccess: () => setConfirmVisible(false) })}
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
});
