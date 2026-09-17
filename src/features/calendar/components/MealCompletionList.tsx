import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { mealCategoryLabels } from '@/features/meals';
import type { PlanItemWithDetails } from '@/features/plans';
import { useTheme } from '@/hooks/use-theme';

export type MealCompletionListProps = {
  items: PlanItemWithDetails[];
  completedIds: Set<string>;
  /** id of the item with a toggle mutation in flight — its row is disabled until it settles, to avoid a double-tap queuing a duplicate insert/delete. */
  pendingId?: string;
  onToggle: (planItemId: string, completed: boolean) => void;
};

/** Checklist of a day's plan meals — toggling one marks it eaten/not eaten. */
export function MealCompletionList({ items, completedIds, pendingId, onToggle }: MealCompletionListProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const completed = completedIds.has(item.id);
        const disabled = item.id === pendingId;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed, disabled }}
            disabled={disabled}
            style={[styles.row, { borderColor: theme.border, opacity: disabled ? 0.6 : 1 }]}
            onPress={() => onToggle(item.id, !completed)}>
            <View
              style={[
                styles.checkbox,
                { borderColor: theme.border, backgroundColor: completed ? theme.accentSecondary : 'transparent' },
              ]}>
              {completed ? <Ionicons name="checkmark" size={14} color={theme.text} /> : null}
            </View>
            <View style={styles.info}>
              <ThemedText type="smallBold" style={completed && styles.strikethrough}>
                {item.meal.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {mealCategoryLabels[item.meal.category]}
              </ThemedText>
            </View>
            {item.meal.recipe_url ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ver receta"
                hitSlop={8}
                style={[styles.recipeButton, { borderColor: theme.accent }]}
                onPress={(event) => {
                  event.stopPropagation();
                  Linking.openURL(item.meal.recipe_url as string);
                }}>
                <Ionicons name="play-circle-outline" size={16} color={theme.accent} />
                <ThemedText type="small" style={{ color: theme.accent }}>
                  Ver receta
                </ThemedText>
              </Pressable>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  recipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});
