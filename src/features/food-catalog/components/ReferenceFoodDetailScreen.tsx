import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorBanner } from '@/components/error-banner';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { MacroDonutChart } from '@/components/macro-donut-chart';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAddReferenceFoodToFoods } from '@/features/food-catalog/hooks/useAddReferenceFoodToFoods';
import { useReferenceFood } from '@/features/food-catalog/hooks/useReferenceFood';
import { useReferenceFoodNutrients } from '@/features/food-catalog/hooks/useReferenceFoodNutrients';
import { buildFoodValues } from '@/features/food-catalog/nutrientMapping';
import { useAuth } from '@/features/auth';
import {
  NutrientChipsRow,
  foodCategoryLabels,
  optionalNutrientFields,
  servingTypeLabels,
  type FoodContribution,
  type OptionalNutrientField,
} from '@/features/foods';

export type ReferenceFoodDetailScreenProps = {
  id: string;
};

const CORE_MACRO_LABELS: Record<'protein_g' | 'carbs_g' | 'fat_g', string> = {
  protein_g: 'Proteína',
  carbs_g: 'Carbohidratos',
  fat_g: 'Grasa',
};

function formatMacro(value: number | null): string {
  return value === null ? 'N/D' : `${value} g`;
}

export function ReferenceFoodDetailScreen({ id }: ReferenceFoodDetailScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: food, isLoading: isLoadingFood } = useReferenceFood(id);
  const { data: nutrientRows, isLoading: isLoadingNutrients } = useReferenceFoodNutrients(id);
  const addToFoods = useAddReferenceFoodToFoods(userId);
  const [addError, setAddError] = useState<string | undefined>();

  if (isLoadingFood || isLoadingNutrients || !food || !nutrientRows) {
    return <FullScreenSpinner />;
  }

  const { core, optional, canMaterialize } = buildFoodValues(nutrientRows);

  const fullOptional = Object.fromEntries(
    optionalNutrientFields.map((field) => [field, optional[field] ?? null]),
  ) as Record<OptionalNutrientField, number | null>;
  const contribution: FoodContribution = {
    // Only feeds the donut's segment math (0 renders as "no segment", same
    // as the chart already treats an all-zero food) — never shown as a
    // number anywhere; the legend below reads straight from `core` and
    // prints "N/D" for anything genuinely missing.
    energy_kcal: core.energy_kcal ?? 0,
    protein_g: core.protein_g ?? 0,
    carbs_g: core.carbs_g ?? 0,
    fat_g: core.fat_g ?? 0,
    ...fullOptional,
  };

  function handleAddToFoods() {
    setAddError(undefined);
    addToFoods.mutate(id, {
      onSuccess: (result) => {
        if (result.status === 'cannot_materialize') return;
        router.push({ pathname: '/(app)/(tabs)/despensa/alimentos/[id]', params: { id: result.foodId } });
      },
      onError: (error) => {
        setAddError(error instanceof Error ? error.message : 'No se ha podido añadir el alimento.');
      },
    });
  }

  return (
    <View style={styles.root}>
      <Screen scroll style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{food.name_es ?? food.name_original}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {foodCategoryLabels[food.category]} · {servingTypeLabels[food.serving_type]} · Catálogo USDA
          </ThemedText>
          {food.name_es ? (
            <ThemedText type="small" themeColor="textSecondary">
              Nombre original (USDA): {food.name_original}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.chartRow}>
          <MacroDonutChart protein_g={contribution.protein_g} carbs_g={contribution.carbs_g} fat_g={contribution.fat_g} />
          <View style={styles.legend}>
            <ThemedText type="small" themeColor="accent">
              {CORE_MACRO_LABELS.protein_g}: {formatMacro(core.protein_g)}
            </ThemedText>
            <ThemedText type="small" themeColor="accentSecondary">
              {CORE_MACRO_LABELS.carbs_g}: {formatMacro(core.carbs_g)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {CORE_MACRO_LABELS.fat_g}: {formatMacro(core.fat_g)}
            </ThemedText>
          </View>
        </View>

        <NutrientChipsRow contribution={contribution} />

        {!canMaterialize ? (
          <ThemedText type="small" themeColor="danger">
            La fuente (USDA) no reporta todos los datos necesarios (energía/proteína/grasa/carbohidratos) para este alimento en
            concreto, así que no se puede añadir a tus alimentos sin inventar un valor.
          </ThemedText>
        ) : null}

        {addError ? <ErrorBanner message={addError} onDismiss={() => setAddError(undefined)} /> : null}

        <Button
          title="Añadir a mis alimentos"
          disabled={!canMaterialize}
          loading={addToFoods.isPending}
          onPress={handleAddToFoods}
        />
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
