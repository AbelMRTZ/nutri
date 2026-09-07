import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { mealCategoryLabels } from '@/features/meals';
import type { PlanItemWithDetails } from '@/features/plans';
import { useTheme } from '@/hooks/use-theme';

export type MealCompletionListProps = {
  items: PlanItemWithDetails[];
  completedIds: Set<string>;
  onToggle: (planItemId: string, completed: boolean) => void;
};

/** Checklist of a day's plan meals — toggling one marks it eaten/not eaten. */
export function MealCompletionList({ items, completedIds, onToggle }: MealCompletionListProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const completed = completedIds.has(item.id);

        return (
          <Pressable
            key={item.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed }}
            style={[styles.row, { borderColor: theme.border }]}
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
});
