import { Pressable, StyleSheet, View } from 'react-native';

import { CollapsibleSection } from '@/components/collapsible-section';
import { ThemedText } from '@/components/themed-text';
import { mealCategoryLabels, mealCategoryOptions, type MealCategory } from '@/features/meals/schema';
import { useTheme } from '@/hooks/use-theme';

export type MealCategoryFilterSectionProps = {
  selected: readonly MealCategory[];
  onToggle: (category: MealCategory) => void;
};

/** Multi-select category filter for Comidas, same collapsible-pills pattern as foods' CategoryFilterSection. */
export function MealCategoryFilterSection({ selected, onToggle }: MealCategoryFilterSectionProps) {
  const theme = useTheme();

  return (
    <CollapsibleSection title={`Categoría${selected.length > 0 ? ` (${selected.length})` : ''}`}>
      <View style={styles.row}>
        {mealCategoryOptions.map((category) => {
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
                {mealCategoryLabels[category]}
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
