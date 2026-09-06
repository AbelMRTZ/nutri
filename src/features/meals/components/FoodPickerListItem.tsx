import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { foodCategoryLabels, servingTypeLabels } from '@/features/foods';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type FoodPickerListItemProps = {
  food: Tables<'foods'>;
  onPress: () => void;
};

export function FoodPickerListItem({ food, onPress }: FoodPickerListItemProps) {
  const theme = useTheme();

  return (
    <Pressable style={[styles.row, { borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{food.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {foodCategoryLabels[food.category]} · {servingTypeLabels[food.serving_type]}
        </ThemedText>
      </View>
      <ThemedText type="small" style={{ color: theme.accent }}>
        {food.energy_kcal} kcal
      </ThemedText>
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
