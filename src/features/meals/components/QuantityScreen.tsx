import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm, useFormState, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { MacroDonutChart } from '@/components/macro-donut-chart';
import { NumericField } from '@/components/numeric-field';
import { OptionPicker } from '@/components/option-picker';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { calculateFoodContribution, NutrientBars, useFood } from '@/features/foods';
import { useCreateMealItem } from '@/features/meals/hooks/useCreateMealItem';
import {
  mealItemFlexibilityLabels,
  mealItemFlexibilityOptions,
  mealItemFormSchema,
  type MealItemFormValues,
} from '@/features/meals/schema';
import type { Tables } from '@/lib/supabase/database.types';

const flexibilityOptionList = mealItemFlexibilityOptions.map((value) => ({
  value,
  label: mealItemFlexibilityLabels[value],
}));

export type QuantityScreenProps = {
  foodId: string;
  mealId: string;
};

/**
 * Thin data-loading wrapper: the actual form (below) needs `food` to exist
 * before it can call useForm with a schema derived from `food.serving_type`,
 * so it's a separate component that only ever mounts once `food` is ready —
 * keeping the early-return here from skipping any hooks conditionally.
 */
export function QuantityScreen({ foodId, mealId }: QuantityScreenProps) {
  const { data: food, isLoading } = useFood(foodId);

  if (isLoading || !food) {
    return <FullScreenSpinner />;
  }

  return <QuantityForm food={food} mealId={mealId} />;
}

function QuantityForm({ food, mealId }: { food: Tables<'foods'>; mealId: string }) {
  const createMealItem = useCreateMealItem(mealId);
  const unit = food.serving_type === 'per_unit' ? 'unidades' : 'g';
  const defaultQuantity = food.serving_type === 'per_unit' ? 1 : 100;

  const { control, handleSubmit } = useForm<MealItemFormValues>({
    resolver: zodResolver(mealItemFormSchema(food.serving_type)),
    defaultValues: { quantity: defaultQuantity, flexibility: 'invariable' },
  });
  // See BasicInfoStep.tsx for why this must be `useFormState`, not
  // `formState` destructured off `useForm()`.
  const { errors } = useFormState({ control });

  const quantity = useWatch({ control, name: 'quantity' });
  const contribution = calculateFoodContribution(food, quantity ?? 0);

  function onSubmit(values: MealItemFormValues) {
    createMealItem.mutate(
      { meal_id: mealId, food_id: food.id, quantity: values.quantity, is_variable: values.flexibility === 'variable' },
      {
        onSuccess: () => {
          router.dismissTo({ pathname: '/(app)/(tabs)/despensa/comidas/[id]', params: { id: mealId } });
        },
      },
    );
  }

  return (
    <Screen scroll style={styles.content}>
      <ThemedText type="subtitle">{food.name}</ThemedText>

      <Controller
        control={control}
        name="quantity"
        render={({ field }) => (
          <NumericField
            label="Cantidad"
            suffix={unit}
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.quantity?.message}
          />
        )}
      />

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

      <Controller
        control={control}
        name="flexibility"
        render={({ field }) => (
          <OptionPicker
            label="Flexibilidad"
            options={flexibilityOptionList}
            value={field.value}
            onChange={field.onChange}
            error={errors.flexibility?.message}
          />
        )}
      />

      <View style={styles.buttonsRow}>
        <Button variant="secondary" title="Descartar" style={styles.flexButton} onPress={() => router.back()} />
        <Button
          title="Añadir a la comida"
          style={styles.flexButton}
          loading={createMealItem.isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
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
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});
