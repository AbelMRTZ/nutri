import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { MacroDonutChart } from '@/components/macro-donut-chart';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { calculateFoodContribution } from '@/features/foods/calculations/contribution';
import { NutrientBars } from '@/features/foods/components/NutrientBars';
import { useFood } from '@/features/foods/hooks/useFood';
import { foodCategoryLabels, servingTypeLabels } from '@/features/foods/schema';

export type FoodDetailScreenProps = {
  id: string;
};

/**
 * Read-only nutrition view for a food, in the same visual language as the
 * "add to a meal" quantity screen (macro donut + nutrient chips) — tapping a
 * food in the Alimentos list used to jump straight into an edit form, which
 * looked identical to creating a brand new food and gave no quick way to
 * just look up its nutrition. Editing now lives one tap away, behind an
 * explicit "Editar" button.
 */
export function FoodDetailScreen({ id }: FoodDetailScreenProps) {
  const router = useRouter();
  const { data: food, isLoading } = useFood(id);

  if (isLoading || !food) {
    return <FullScreenSpinner />;
  }

  const perServingQuantity = food.serving_type === 'per_100g' ? 100 : 1;
  const contribution = calculateFoodContribution(food, perServingQuantity);

  return (
    <Screen scroll style={styles.content}>
      <View style={styles.header}>
        <ThemedText type="subtitle">{food.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {foodCategoryLabels[food.category]} · {servingTypeLabels[food.serving_type]}
        </ThemedText>
        {food.source_reference_food_id ? (
          <ThemedText type="small" themeColor="textSecondary">
            Importado del catálogo USDA
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.chartRow}>
        <MacroDonutChart protein_g={contribution.protein_g} carbs_g={contribution.carbs_g} fat_g={contribution.fat_g} />
        <View style={styles.legend}>
          <ThemedText type="small" themeColor="accent">
            Proteína: {contribution.protein_g} g
          </ThemedText>
          <ThemedText type="small" themeColor="accentSecondary">
            Carbohidratos: {contribution.carbs_g} g
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Grasa: {contribution.fat_g} g
          </ThemedText>
        </View>
      </View>

      <NutrientBars contribution={contribution} servingType={food.serving_type} />

      <Button
        variant="secondary"
        title="Editar alimento"
        onPress={() =>
          router.push({ pathname: '/(app)/(tabs)/despensa/alimentos/editar/[id]', params: { id: food.id } })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  header: {
    gap: 4,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  legend: {
    flex: 1,
    gap: 6,
  },
});
