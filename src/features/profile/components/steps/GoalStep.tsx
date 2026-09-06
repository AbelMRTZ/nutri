import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { LabeledSlider } from '@/components/labeled-slider';
import { NumericField } from '@/components/numeric-field';
import { OptionPicker } from '@/components/option-picker';
import { goalLabels, goalOptions, type ProfileFormValues } from '@/features/profile/schema';

const goalOptionList = goalOptions.map((value) => ({ value, label: goalLabels[value] }));
const DEFAULT_PACE = 0.4;

export function GoalStep() {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProfileFormValues>();
  const goal = useWatch<ProfileFormValues, 'goal'>({ control, name: 'goal' });

  // The slider below *displays* a fallback of 0.4 when unset, so it must also
  // register that value the moment it becomes relevant — otherwise the UI
  // shows a ritmo the form doesn't actually have, and submit fails silently.
  useEffect(() => {
    if (goal && goal !== 'maintain' && getValues('pace_kg_per_week') === undefined) {
      setValue('pace_kg_per_week', DEFAULT_PACE, { shouldValidate: true });
    }
  }, [goal, getValues, setValue]);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="goal"
        render={({ field }) => (
          <OptionPicker label="Objetivo" options={goalOptionList} value={field.value} onChange={field.onChange} error={errors.goal?.message} />
        )}
      />

      {goal && goal !== 'maintain' ? (
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
                error={errors.target_weight_kg?.message}
              />
            )}
          />
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
