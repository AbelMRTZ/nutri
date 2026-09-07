import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { routineFormSchema, type RoutineFormValues } from '@/features/routines/schema';

export type RoutineFormProps = {
  defaultValues: Partial<RoutineFormValues>;
  onSubmit: (values: RoutineFormValues) => void;
  submitLabel?: string;
  submitting?: boolean;
  footer?: React.ReactNode;
};

export function RoutineForm({ defaultValues, onSubmit, submitLabel = 'Guardar rutina', submitting, footer }: RoutineFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoutineFormValues>({
    resolver: zodResolver(routineFormSchema),
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
