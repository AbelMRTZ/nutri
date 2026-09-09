import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { foodCategoryLabels } from '@/features/foods/schema';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type ReferenceFoodListItemProps = {
  food: Tables<'reference_foods'>;
  onPress: () => void;
};

export function ReferenceFoodListItem({ food, onPress }: ReferenceFoodListItemProps) {
  const theme = useTheme();

  return (
    <Pressable style={[styles.row, { borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{food.name_es ?? food.name_original}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {foodCategoryLabels[food.category]} · Catálogo USDA
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
