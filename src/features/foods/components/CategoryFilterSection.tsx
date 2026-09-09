import { Pressable, StyleSheet, View } from 'react-native';

import { CollapsibleSection } from '@/components/collapsible-section';
import { ThemedText } from '@/components/themed-text';
import { foodCategoryLabels, foodCategoryOptions, type FoodCategory } from '@/features/foods/schema';
import { useTheme } from '@/hooks/use-theme';

export type CategoryFilterSectionProps = {
  selected: readonly FoodCategory[];
  onToggle: (category: FoodCategory) => void;
};

/**
 * Multi-select category filter (tap to add/remove, several at once), tucked
 * behind a collapsible header — a single-select "Categoría" picker used to
 * sit permanently expanded and took up a lot of vertical space above the
 * results list. Collapsed by default; the count in the title says whether a
 * filter is still active without needing to expand it back open.
 */
export function CategoryFilterSection({ selected, onToggle }: CategoryFilterSectionProps) {
  const theme = useTheme();

  return (
    <CollapsibleSection title={`Categoría${selected.length > 0 ? ` (${selected.length})` : ''}`}>
      <View style={styles.row}>
        {foodCategoryOptions.map((category) => {
          const isSelected = selected.includes(category);
          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onToggle(category)}
              style={[
                styles.pill,
                { backgroundColor: isSelected ? theme.accent : 'transparent', borderColor: isSelected ? theme.accent : theme.border },
              ]}>
              <ThemedText type="smallBold" style={{ color: isSelected ? '#FFFFFF' : theme.text }}>
                {foodCategoryLabels[category]}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});
