import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useFormState, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { NumericField } from '@/components/numeric-field';
import { OptionPicker } from '@/components/option-picker';
import { TextField } from '@/components/text-field';
import { planFormSchema, planTypeLabels, planTypeOptions, type PlanFormValues } from '@/features/plans/schema';

const typeOptionList = planTypeOptions.map((value) => ({ value, label: planTypeLabels[value] }));

export type PlanFormProps = {
  defaultValues: Partial<PlanFormValues>;
  onSubmit: (values: PlanFormValues) => void;
  submitLabel?: string;
  submitting?: boolean;
  footer?: React.ReactNode;
};

export function PlanForm({ defaultValues, onSubmit, submitLabel = 'Guardar plan', submitting, footer }: PlanFormProps) {
  const { control, handleSubmit } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: { name: '', type: 'standard', ...defaultValues },
  });
  // `useFormState` (not `formState` off `useForm()`) — see BasicInfoStep.tsx
  // for why: the React Compiler doesn't track react-hook-form's Proxy-based
  // read tracking, so errors silently stopped updating the UI without it.
  const { errors } = useFormState({ control });

  const type = useWatch({ control, name: 'type' });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            label="Nombre"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <OptionPicker
            label="Tipo de plan"
            options={typeOptionList}
            value={field.value}
            onChange={field.onChange}
            error={errors.type?.message}
          />
        )}
      />

      {type === 'special' ? (
        <>
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
                label="Proteína objetivo"
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
                label="Carbohidratos objetivo"
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
                label="Grasa objetivo"
                suffix="g"
                value={field.value}
                onChangeNumber={field.onChange}
                error={errors.fat_g_target?.message}
              />
            )}
          />
        </>
      ) : null}

      <Button title={submitLabel} onPress={handleSubmit(onSubmit)} loading={submitting} />
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
