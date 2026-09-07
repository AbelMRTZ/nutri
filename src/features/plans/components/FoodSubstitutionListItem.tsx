import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { foodCategoryLabels, type SubstitutionSuggestion } from '@/features/foods';
import { useTheme } from '@/hooks/use-theme';

export type FoodSubstitutionListItemProps = {
  suggestion: SubstitutionSuggestion;
  onPress: () => void;
};

export function FoodSubstitutionListItem({ suggestion, onPress }: FoodSubstitutionListItemProps) {
  const theme = useTheme();
  const { food, quantity, contribution, similarity } = suggestion;
  const unit = food.serving_type === 'per_unit' ? 'ud.' : 'g';

  return (
    <Pressable style={[styles.row, { borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.info}>
        <ThemedText type="smallBold">{food.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {foodCategoryLabels[food.category]} · {quantity} {unit} · {contribution.energy_kcal} kcal
        </ThemedText>
      </View>
      <View style={[styles.similarityBadge, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="smallBold" style={{ color: theme.accentSecondary }}>
          {similarity}%
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
  similarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
});
