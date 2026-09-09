import { useEffect, useState } from 'react';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { LabeledSlider } from '@/components/labeled-slider';
import { NumericField } from '@/components/numeric-field';
import { OptionPicker } from '@/components/option-picker';
import { ThemedText } from '@/components/themed-text';
import type { ProfileFormValues } from '@/features/profile/schema';

/**
 * The DB/schema still store `goal` as lose|maintain|gain (calculateCaloriesTarget
 * needs the sign), but the app-level distinction between "lose" and "gain" is
 * redundant with the target weight the user is about to enter anyway — so the
 * picker only offers "maintain" vs. "change", and the real goal is derived
 * from comparing target_weight_kg to weight_kg once both are known.
 */
const uiGoalOptions = [
  { value: 'maintain', label: 'Mantener peso' },
  { value: 'change', label: 'Ganar/Perder peso' },
] as const;
type UiGoal = (typeof uiGoalOptions)[number]['value'];

const DEFAULT_PACE = 0.4;

export function GoalStep() {
  const { control, setValue, getValues } = useFormContext<ProfileFormValues>();
  // See BasicInfoStep.tsx for why this must be `useFormState`, not
  // `formState` destructured off `useFormContext()`.
  const { errors } = useFormState({ control });
  const goal = useWatch<ProfileFormValues, 'goal'>({ control, name: 'goal' });
  const weightKg = useWatch<ProfileFormValues, 'weight_kg'>({ control, name: 'weight_kg' });
  const targetWeightKg = useWatch<ProfileFormValues, 'target_weight_kg'>({ control, name: 'target_weight_kg' });

  const [uiGoal, setUiGoal] = useState<UiGoal | undefined>(() =>
    goal === 'maintain' ? 'maintain' : goal ? 'change' : undefined,
  );

  // Derive lose/gain from how the target compares to the current weight —
  // re-runs on every keystroke in the target weight field, so switching a
  // "31kg lighter" goal to "5kg heavier" flips the sign automatically.
  useEffect(() => {
    if (uiGoal !== 'change') return;
    if (weightKg === undefined || targetWeightKg === undefined || targetWeightKg === weightKg) return;
    setValue('goal', targetWeightKg < weightKg ? 'lose' : 'gain', { shouldValidate: true });
  }, [uiGoal, weightKg, targetWeightKg, setValue]);

  // The slider below *displays* a fallback of DEFAULT_PACE when unset, so it
  // must also register that value the moment a real (non-maintain) goal is
  // derived — otherwise the UI shows a ritmo the form doesn't actually have,
  // and the required-when-not-maintaining check in the schema blocks submit.
  useEffect(() => {
    if (goal && goal !== 'maintain' && getValues('pace_kg_per_week') === undefined) {
      setValue('pace_kg_per_week', DEFAULT_PACE, { shouldValidate: true });
    }
  }, [goal, getValues, setValue]);

  function handleUiGoalChange(next: UiGoal) {
    setUiGoal(next);
    if (next === 'maintain') {
      setValue('goal', 'maintain', { shouldValidate: true });
      setValue('target_weight_kg', undefined, { shouldValidate: true });
      setValue('pace_kg_per_week', undefined, { shouldValidate: true });
    }
    // For "change", `goal` is left for the effect above to derive once a
    // target weight distinct from the current one is entered.
  }

  const needsDifferentTargetWeight =
    uiGoal === 'change' && weightKg !== undefined && targetWeightKg !== undefined && targetWeightKg === weightKg;

  return (
    <View style={styles.container}>
      <OptionPicker
        label="Objetivo"
        options={uiGoalOptions}
        value={uiGoal}
        onChange={handleUiGoalChange}
        error={uiGoal === undefined ? errors.goal?.message : undefined}
      />

      {uiGoal === 'change' ? (
        <>
          <Controller
            control={control}
            name="target_weight_kg"
            render={({ field }) => (
              <NumericField
                label="Peso objetivo"
                suffix="kg"
                value={field.value}
                onChangeNumber={field.onChange}
                error={needsDifferentTargetWeight ? 'Debe ser distinto a tu peso actual' : errors.target_weight_kg?.message}
              />
            )}
          />
          {errors.goal?.message && !needsDifferentTargetWeight ? (
            <ThemedText type="small" themeColor="danger">
              Indica un peso objetivo distinto a tu peso actual.
            </ThemedText>
          ) : null}
          <Controller
            control={control}
            name="pace_kg_per_week"
            render={({ field }) => (
              <LabeledSlider
                label="Ritmo del objetivo (kg/semana)"
                value={field.value ?? DEFAULT_PACE}
                minimumValue={0.1}
                maximumValue={0.7}
                step={0.1}
                onValueChange={field.onChange}
                error={errors.pace_kg_per_week?.message}
              />
            )}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
