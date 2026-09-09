import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useFormState } from 'react-hook-form';
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
  const { control, handleSubmit } = useForm<RoutineFormValues>({
    resolver: zodResolver(routineFormSchema),
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
