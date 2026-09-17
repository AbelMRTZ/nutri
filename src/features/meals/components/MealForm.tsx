import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useFormState } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { OptionPicker } from '@/components/option-picker';
import { TextField } from '@/components/text-field';
import { mealCategoryLabels, mealCategoryOptions, mealFormSchema, type MealFormValues } from '@/features/meals/schema';

const categoryOptionList = mealCategoryOptions.map((value) => ({ value, label: mealCategoryLabels[value] }));

export type MealFormProps = {
  defaultValues: Partial<MealFormValues>;
  onSubmit: (values: MealFormValues) => void;
  submitLabel?: string;
  submitting?: boolean;
  footer?: React.ReactNode;
};

export function MealForm({ defaultValues, onSubmit, submitLabel = 'Guardar comida', submitting, footer }: MealFormProps) {
  const { control, handleSubmit } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: { name: '', recipe_url: '', ...defaultValues },
  });
  // See BasicInfoStep.tsx for why this must be `useFormState`, not
  // `formState` destructured off `useForm()`.
  const { errors } = useFormState({ control });

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
        name="category"
        render={({ field }) => (
          <OptionPicker
            label="Categoría"
            options={categoryOptionList}
            value={field.value}
            onChange={field.onChange}
            error={errors.category?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="recipe_url"
        render={({ field }) => (
          <TextField
            label="Enlace a la receta (opcional)"
            placeholder="https://..."
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.recipe_url?.message}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        )}
      />

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
