import { useEffect, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { NumericField } from '@/components/numeric-field';
import { ThemedText } from '@/components/themed-text';
import { calculateDefaultMacros } from '@/features/profile/calculations/macros';
import { calculateCaloriesTarget } from '@/features/profile/calculations/tdee';
import { hasMacroInputs, type ProfileFormValues } from '@/features/profile/schema';

export function MacrosReviewStep() {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProfileFormValues>();

  const watched = useWatch<ProfileFormValues>({ control });

  const suggestion = useMemo(() => {
    if (!hasMacroInputs(watched)) return null;
    const calories_target = calculateCaloriesTarget(watched);
    return { calories_target, ...calculateDefaultMacros(calories_target, watched.weight_kg) };
  }, [watched]);

  // Pre-fill once the base inputs are known, without stomping on a value the
  // user has already reviewed/edited on a previous visit to this step.
  useEffect(() => {
    if (!suggestion) return;
    if (getValues('calories_target') === undefined) {
      applySuggestion(suggestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestion?.calories_target]);

  function applySuggestion(values: NonNullable<typeof suggestion>) {
    setValue('calories_target', values.calories_target, { shouldValidate: true });
    setValue('protein_g_target', values.protein_g_target, { shouldValidate: true });
    setValue('carbs_g_target', values.carbs_g_target, { shouldValidate: true });
    setValue('fat_g_target', values.fat_g_target, { shouldValidate: true });
  }

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        Calculado a partir de tus datos. Puedes ajustar cualquier valor manualmente.
      </ThemedText>

      <Controller
        control={control}
        name="calories_target"
        render={({ field }) => (
          <NumericField
            label="Calorías objetivo"
            suffix="kcal"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.calories_target?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="protein_g_target"
        render={({ field }) => (
          <NumericField
            label="Proteína"
            suffix="g"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.protein_g_target?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="carbs_g_target"
        render={({ field }) => (
          <NumericField
            label="Carbohidratos"
            suffix="g"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.carbs_g_target?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="fat_g_target"
        render={({ field }) => (
          <NumericField
            label="Grasa"
            suffix="g"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.fat_g_target?.message}
          />
        )}
      />

      {suggestion ? (
        <Button variant="ghost" title="Recalcular sugerencia automática" onPress={() => applySuggestion(suggestion)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
