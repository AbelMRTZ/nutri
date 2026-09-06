import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { calculateFoodContribution } from '@/features/foods';
import { mealCategoryLabels } from '@/features/meals';
import type { PlanItemWithDetails } from '@/features/plans/api/planItems';
import { useDeletePlanItem } from '@/features/plans/hooks/useDeletePlanItem';
import { useUpdatePlanItemFoodQuantity } from '@/features/plans/hooks/useUpdatePlanItemFoodQuantity';
import { isValidPlanItemFoodQuantity } from '@/features/plans/schema';
import { useTheme } from '@/hooks/use-theme';

export type PlanMealGroupProps = {
  item: PlanItemWithDetails;
  planId: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function PlanMealGroup({ item, planId, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: PlanMealGroupProps) {
  const theme = useTheme();
  const deletePlanItem = useDeletePlanItem(planId);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.reorderButtons}>
          <Pressable
            accessibilityLabel="Subir comida"
            disabled={!canMoveUp}
            hitSlop={8}
            onPress={onMoveUp}
            style={{ opacity: canMoveUp ? 1 : 0.3 }}>
            <Ionicons name="chevron-up" size={18} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            accessibilityLabel="Bajar comida"
            disabled={!canMoveDown}
            hitSlop={8}
            onPress={onMoveDown}
            style={{ opacity: canMoveDown ? 1 : 0.3 }}>
            <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.headerInfo}>
          <ThemedText type="smallBold">{item.meal.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {mealCategoryLabels[item.meal.category]}
          </ThemedText>
        </View>
        <Pressable accessibilityLabel="Quitar comida" hitSlop={10} onPress={() => setConfirmVisible(true)}>
          <Ionicons name="close-circle-outline" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.foods}>
        {item.plan_item_foods.map((planItemFood) => (
          <PlanItemFoodRow key={planItemFood.id} planItemFood={planItemFood} planId={planId} />
        ))}
      </View>

      <ConfirmDialog
        visible={confirmVisible}
        title="Quitar comida"
        description={`¿Quitar "${item.meal.name}" de este plan?`}
        confirmLabel="Quitar"
        loading={deletePlanItem.isPending}
        onConfirm={() => deletePlanItem.mutate(item.id, { onSuccess: () => setConfirmVisible(false) })}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

function PlanItemFoodRow({
  planItemFood,
  planId,
}: {
  planItemFood: PlanItemWithDetails['plan_item_foods'][number];
  planId: string;
}) {
  const theme = useTheme();
  const updateQuantity = useUpdatePlanItemFoodQuantity(planId);
  const [draftQuantity, setDraftQuantity] = useState<number | undefined>(planItemFood.quantity);

  const food = planItemFood.food;
  const unit = food.serving_type === 'per_unit' ? 'unidades' : 'g';
  const contribution = calculateFoodContribution(food, draftQuantity ?? 0);

  function commitQuantity() {
    if (draftQuantity === undefined || draftQuantity === planItemFood.quantity) return;
    if (!isValidPlanItemFoodQuantity(draftQuantity, food.serving_type)) {
      setDraftQuantity(planItemFood.quantity);
      return;
    }
    updateQuantity.mutate({ id: planItemFood.id, quantity: draftQuantity });
  }

  return (
    <View style={styles.foodRow}>
      <View style={styles.foodInfo}>
        <ThemedText type="small">{food.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {contribution.energy_kcal} kcal · {planItemFood.is_variable ? 'Variable' : 'Invariable'}
        </ThemedText>
      </View>
      {planItemFood.is_variable ? (
        <View style={[styles.quantityInputRow, { borderColor: theme.border }]}>
          <TextInput
            keyboardType="decimal-pad"
            value={draftQuantity === undefined ? '' : String(draftQuantity)}
            onChangeText={(text) => {
              const normalized = text.replace(',', '.');
              if (normalized === '') {
                setDraftQuantity(undefined);
                return;
              }
              const parsed = Number(normalized);
              setDraftQuantity(Number.isNaN(parsed) ? undefined : parsed);
            }}
            onBlur={commitQuantity}
            style={[styles.quantityInput, { color: theme.text }]}
          />
          <ThemedText type="small" themeColor="textSecondary">
            {unit}
          </ThemedText>
        </View>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          {planItemFood.quantity} {unit}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reorderButtons: {
    gap: 2,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  foods: {
    gap: 10,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foodInfo: {
    flex: 1,
    gap: 2,
  },
  quantityInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quantityInput: {
    minWidth: 40,
    fontSize: 14,
    textAlign: 'right',
  },
});
