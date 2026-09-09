import { useEffect, useMemo, useRef } from 'react';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { NumericField } from '@/components/numeric-field';
import { ThemedText } from '@/components/themed-text';
import { calculateDefaultMacros } from '@/features/profile/calculations/macros';
import { calculateCaloriesTarget } from '@/features/profile/calculations/tdee';
import { hasMacroInputs, type ProfileFormValues } from '@/features/profile/schema';

type MacroSuggestion = {
  calories_target: number;
  protein_g_target: number;
  carbs_g_target: number;
  fat_g_target: number;
};

export function MacrosReviewStep() {
  const { control, setValue, getValues } = useFormContext<ProfileFormValues>();
  // See BasicInfoStep.tsx for why this must be `useFormState`, not
  // `formState` destructured off `useFormContext()`.
  const { errors } = useFormState({ control });

  const watched = useWatch<ProfileFormValues>({ control });
  // The last suggestion actually written into the form (by this effect or
  // by the "recalcular" button) — lets us tell "the user hasn't touched
  // these fields since we last suggested something" apart from "the user
  // edited them manually", so a goal/weight change on a previous step can
  // still recalculate automatically without ever stomping a real edit.
  const lastAppliedSuggestion = useRef<MacroSuggestion | null>(null);

  const suggestion = useMemo(() => {
    if (!hasMacroInputs(watched)) return null;
    const calories_target = calculateCaloriesTarget(watched);
    return { calories_target, ...calculateDefaultMacros(calories_target, watched.weight_kg) };
  }, [watched]);

  useEffect(() => {
    if (!suggestion) return;

    const last = lastAppliedSuggestion.current;
    // `suggestion` is a new object every render `watched` changes identity,
    // even when its values didn't — bail out before doing anything else
    // once it matches what's already applied, or every render anywhere in
    // the form (now that every wizard step stays mounted) would re-run
    // applySuggestion forever, each call triggering the next render.
    if (
      last !== null &&
      suggestion.calories_target === last.calories_target &&
      suggestion.protein_g_target === last.protein_g_target &&
      suggestion.carbs_g_target === last.carbs_g_target &&
      suggestion.fat_g_target === last.fat_g_target
    ) {
      return;
    }

    const current: { [K in keyof MacroSuggestion]: number | undefined } = {
      calories_target: getValues('calories_target'),
      protein_g_target: getValues('protein_g_target'),
      carbs_g_target: getValues('carbs_g_target'),
      fat_g_target: getValues('fat_g_target'),
    };
    const untouchedSinceLastSuggestion =
      current.calories_target === undefined ||
      (last !== null &&
        current.calories_target === last.calories_target &&
        current.protein_g_target === last.protein_g_target &&
        current.carbs_g_target === last.carbs_g_target &&
        current.fat_g_target === last.fat_g_target);

    if (untouchedSinceLastSuggestion) {
      applySuggestion(suggestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestion]);

  function applySuggestion(values: MacroSuggestion) {
    lastAppliedSuggestion.current = values;
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
