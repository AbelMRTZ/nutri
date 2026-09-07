import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { OptionPicker } from '@/components/option-picker';
import { TextField } from '@/components/text-field';
import {
  equipmentLabels,
  equipmentOptions,
  exerciseFormSchema,
  muscleGroupLabels,
  muscleGroupOptions,
  type ExerciseFormValues,
} from '@/features/exercises/schema';

const muscleGroupOptionList = muscleGroupOptions.map((value) => ({ value, label: muscleGroupLabels[value] }));
const equipmentOptionList = equipmentOptions.map((value) => ({ value, label: equipmentLabels[value] }));

export type ExerciseFormProps = {
  defaultValues: Partial<ExerciseFormValues>;
  onSubmit: (values: ExerciseFormValues) => void;
  submitLabel?: string;
  submitting?: boolean;
  footer?: React.ReactNode;
};

export function ExerciseForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Guardar ejercicio',
  submitting,
  footer,
}: ExerciseFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: { name: '', ...defaultValues },
  });

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
        name="muscle_group"
        render={({ field }) => (
          <OptionPicker
            label="Grupo muscular"
            options={muscleGroupOptionList}
            value={field.value}
            onChange={field.onChange}
            error={errors.muscle_group?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="equipment"
        render={({ field }) => (
          <OptionPicker
            label="Equipo"
            options={equipmentOptionList}
            value={field.value}
            onChange={field.onChange}
            error={errors.equipment?.message}
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
