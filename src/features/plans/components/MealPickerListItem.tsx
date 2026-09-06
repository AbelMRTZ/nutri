import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { mealCategoryLabels } from '@/features/meals';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type MealPickerListItemProps = {
  meal: Tables<'meals'>;
  onPress: () => void;
};

export function MealPickerListItem({ meal, onPress }: MealPickerListItemProps) {
  const theme = useTheme();

  return (
    <Pressable style={[styles.row, { borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{meal.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {mealCategoryLabels[meal.category]}
        </ThemedText>
      </View>
    </Pressable>
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
