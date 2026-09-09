import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useFormState, type Control, type FieldErrors, type Path } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { CollapsibleSection } from '@/components/collapsible-section';
import { NumericField } from '@/components/numeric-field';
import { OptionPicker } from '@/components/option-picker';
import { TextField } from '@/components/text-field';
import {
  foodCategoryLabels,
  foodCategoryOptions,
  foodFormSchema,
  servingTypeLabels,
  servingTypeOptions,
  type FoodFormValues,
} from '@/features/foods/schema';

const categoryOptionList = foodCategoryOptions.map((value) => ({ value, label: foodCategoryLabels[value] }));
const servingTypeOptionList = servingTypeOptions.map((value) => ({ value, label: servingTypeLabels[value] }));

export type FoodFormProps = {
  defaultValues: Partial<FoodFormValues>;
  onSubmit: (values: FoodFormValues) => void;
  submitLabel?: string;
  submitting?: boolean;
  footer?: React.ReactNode;
};

export function FoodForm({ defaultValues, onSubmit, submitLabel = 'Guardar alimento', submitting, footer }: FoodFormProps) {
  const { control, handleSubmit } = useForm<FoodFormValues>({
    resolver: zodResolver(foodFormSchema),
    // `name` backs a plain (non-numeric) TextField, so it needs a defined
    // string default from the start — otherwise the input flips from
    // uncontrolled to controlled the moment the user types.
    defaultValues: { name: '', ...defaultValues },
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
        name="serving_type"
        render={({ field }) => (
          <OptionPicker
            label="Porciones"
            options={servingTypeOptionList}
            value={field.value}
            onChange={field.onChange}
            error={errors.serving_type?.message}
          />
        )}
      />

      <Num control={control} errors={errors} name="energy_kcal" label="Energía" suffix="kcal" />
      <Num control={control} errors={errors} name="protein_g" label="Proteína" suffix="g" />
      <Num control={control} errors={errors} name="carbs_g" label="Carbohidratos" suffix="g" />
      <Num control={control} errors={errors} name="fat_g" label="Grasa" suffix="g" />

      <CollapsibleSection title="Detalle de grasas">
        <Num control={control} errors={errors} name="saturated_fat_g" label="Saturada" suffix="g" />
        <Num control={control} errors={errors} name="monounsaturated_fat_g" label="Monoinsaturada" suffix="g" />
        <Num control={control} errors={errors} name="polyunsaturated_fat_g" label="Poliinsaturada" suffix="g" />
      </CollapsibleSection>

      <CollapsibleSection title="Otros macronutrientes">
        <Num control={control} errors={errors} name="fiber_g" label="Fibra" suffix="g" />
        <Num control={control} errors={errors} name="sugar_g" label="Azúcar" suffix="g" />
        <Num control={control} errors={errors} name="salt_g" label="Sal" suffix="g" />
        <Num control={control} errors={errors} name="omega3_g" label="Omega-3" suffix="g" />
        <Num control={control} errors={errors} name="cholesterol_mg" label="Colesterol" suffix="mg" />
        <Num control={control} errors={errors} name="caffeine_mg" label="Cafeína" suffix="mg" />
      </CollapsibleSection>

      <CollapsibleSection title="Vitaminas">
        <Num control={control} errors={errors} name="vitamin_c_mg" label="Vitamina C" suffix="mg" />
        <Num control={control} errors={errors} name="vitamin_a_mcg" label="Vitamina A" suffix="mcg" />
        <Num control={control} errors={errors} name="vitamin_d_mcg" label="Vitamina D" suffix="mcg" />
        <Num control={control} errors={errors} name="vitamin_e_mcg" label="Vitamina E" suffix="mcg" />
        <Num control={control} errors={errors} name="vitamin_k_mcg" label="Vitamina K" suffix="mcg" />
        <Num control={control} errors={errors} name="vitamin_b1_mg" label="B1" suffix="mg" />
        <Num control={control} errors={errors} name="vitamin_b2_mg" label="B2" suffix="mg" />
        <Num control={control} errors={errors} name="vitamin_b3_mg" label="B3" suffix="mg" />
        <Num control={control} errors={errors} name="vitamin_b5_mg" label="B5" suffix="mg" />
        <Num control={control} errors={errors} name="vitamin_b6_mg" label="B6" suffix="mg" />
        <Num control={control} errors={errors} name="vitamin_b7_mcg" label="B7" suffix="mcg" />
        <Num control={control} errors={errors} name="vitamin_b8_mcg" label="B8" suffix="mcg" />
        <Num control={control} errors={errors} name="vitamin_b12_mcg" label="B12" suffix="mcg" />
      </CollapsibleSection>

      <CollapsibleSection title="Minerales">
        <Num control={control} errors={errors} name="calcium_mg" label="Calcio" suffix="mg" />
        <Num control={control} errors={errors} name="iron_mg" label="Hierro" suffix="mg" />
        <Num control={control} errors={errors} name="magnesium_mg" label="Magnesio" suffix="mg" />
        <Num control={control} errors={errors} name="phosphorus_mg" label="Fósforo" suffix="mg" />
        <Num control={control} errors={errors} name="potassium_mg" label="Potasio" suffix="mg" />
        <Num control={control} errors={errors} name="sodium_mg" label="Sodio" suffix="mg" />
        <Num control={control} errors={errors} name="zinc_mg" label="Zinc" suffix="mg" />
      </CollapsibleSection>

      <Button title={submitLabel} onPress={handleSubmit(onSubmit)} loading={submitting} />
      {footer}
    </View>
  );
}

/** Wires one numeric field's Controller + NumericField + error, cutting the ~29x repetition above. */
function Num({
  control,
  errors,
  name,
  label,
  suffix,
}: {
  control: Control<FoodFormValues>;
  errors: FieldErrors<FoodFormValues>;
  name: Path<FoodFormValues>;
  label: string;
  suffix: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <NumericField
          label={label}
          suffix={suffix}
          value={field.value as number | undefined}
          onChangeNumber={field.onChange}
          error={errors[name]?.message as string | undefined}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
