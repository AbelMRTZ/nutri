import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { NumericField } from '@/components/numeric-field';
import { OptionPicker } from '@/components/option-picker';
import { sexLabels, sexOptions, type ProfileFormValues } from '@/features/profile/schema';

const sexOptionList = sexOptions.map((value) => ({ value, label: sexLabels[value] }));

export function BasicInfoStep() {
  const { control } = useFormContext<ProfileFormValues>();
  // `useFormState` (not `formState` destructured off `useFormContext()`) is
  // required here: react-hook-form normally tracks which `errors` fields a
  // component reads via a Proxy and re-renders it directly when they change,
  // but the React Compiler's static memoization doesn't see that hidden
  // Proxy read as a dependency, so the step silently never re-rendered when
  // a sibling called `trigger()` on Siguiente — `useFormState` returns a
  // plain new object on every relevant change instead, which the compiler
  // does track correctly.
  const { errors } = useFormState({ control });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="age"
        render={({ field }) => (
          <NumericField
            label="Edad"
            suffix="años"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.age?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="height_cm"
        render={({ field }) => (
          <NumericField
            label="Altura"
            suffix="cm"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.height_cm?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="weight_kg"
        render={({ field }) => (
          <NumericField
            label="Peso"
            suffix="kg"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.weight_kg?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="sex"
        render={({ field }) => (
          <OptionPicker label="Sexo" options={sexOptionList} value={field.value} onChange={field.onChange} error={errors.sex?.message} />
        )}
      />
      <Controller
        control={control}
        name="body_fat_pct"
        render={({ field }) => (
          <NumericField
            label="Porcentaje de grasa corporal (opcional)"
            suffix="%"
            value={field.value}
            onChangeNumber={field.onChange}
            error={errors.body_fat_pct?.message}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
