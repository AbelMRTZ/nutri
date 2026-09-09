import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { FoodContribution } from '@/features/foods/calculations/contribution';
import { classifyNutrientLevel, NUTRIENT_LEVEL_ORDER, type NutrientLevel } from '@/features/foods/nutrientThresholds';
import { nutrientLabels, optionalNutrientFields } from '@/features/foods/schema';
import { useTheme } from '@/hooks/use-theme';

export type NutrientBarsProps = {
  contribution: FoodContribution;
  servingType: 'per_100g' | 'per_unit';
};

const LEVEL_LABEL: Record<NutrientLevel, string> = {
  alta: 'Alta',
  baja: 'Baja',
  sin_clasificar: '',
  nula: 'Nula',
  desconocido: 'Desconocido',
};

/**
 * One thin, full-width bar per nutrient — replaces the old wrapping grid of
 * bordered chips. Sorted by level (see NUTRIENT_LEVEL_ORDER): the foods
 * with something notable to say (alta/baja) surface above the ones that
 * don't (nula/desconocido), so e.g. lentils show "Hierro: Alta" near the
 * top and "Cafeína: Desconocido" at the bottom, instead of a flat
 * alphabetical/insertion-order list a user has to scan in full.
 */
export function NutrientBars({ contribution, servingType }: NutrientBarsProps) {
  const theme = useTheme();

  const levelColor: Record<NutrientLevel, string> = {
    alta: theme.accent,
    baja: theme.accentSecondary,
    sin_clasificar: theme.textSecondary,
    nula: theme.textSecondary,
    desconocido: theme.placeholder,
  };

  const rows = optionalNutrientFields
    .map((field) => {
      const value = contribution[field];
      const level = classifyNutrientLevel(field, value, servingType);
      return { field, value, level };
    })
    .sort((a, b) => NUTRIENT_LEVEL_ORDER.indexOf(a.level) - NUTRIENT_LEVEL_ORDER.indexOf(b.level));

  return (
    <View style={styles.container}>
      {rows.map(({ field, value, level }) => {
        const { label, unit } = nutrientLabels[field];
        const color = levelColor[level];
        const amountText = level === 'desconocido' ? LEVEL_LABEL.desconocido : `${value} ${unit}`;
        const levelBadge = level === 'alta' || level === 'baja' ? LEVEL_LABEL[level] : null;

        return (
          <View key={field} style={[styles.bar, { backgroundColor: `${color}1A`, borderColor: color }]}>
            <ThemedText type="small">{label}</ThemedText>
            <View style={styles.amountGroup}>
              {levelBadge ? (
                <ThemedText type="small" style={{ color }}>
                  {levelBadge}
                </ThemedText>
              ) : null}
              <ThemedText type="smallBold" style={{ color }}>
                {amountText}
              </ThemedText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 3,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  amountGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
