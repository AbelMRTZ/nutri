import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { FoodContribution } from '@/features/foods/calculations/contribution';
import { nutrientLabels, optionalNutrientFields } from '@/features/foods/schema';
import { useTheme } from '@/hooks/use-theme';

export type NutrientChipsRowProps = {
  contribution: FoodContribution;
};

/** Wrapping row of "nutrient: value" chips for whichever optional fields this food defines. */
export function NutrientChipsRow({ contribution }: NutrientChipsRowProps) {
  const theme = useTheme();

  const definedFields = optionalNutrientFields.filter((field) => contribution[field] !== null);

  if (definedFields.length === 0) {
    return null;
  }

  return (
    <View style={styles.row}>
      {definedFields.map((field) => {
        const { label, unit } = nutrientLabels[field];
        return (
          <View key={field} style={[styles.chip, { borderColor: theme.border }]}>
            <ThemedText type="small" themeColor="textSecondary">
              {label}
            </ThemedText>
            <ThemedText type="smallBold">
              {contribution[field]} {unit}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 2,
  },
});
