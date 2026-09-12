import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Controller, useForm, useFormState, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { NumericField } from '@/components/numeric-field';
import { OptionPicker } from '@/components/option-picker';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { resolveMet, calculateActivityCalories } from '@/features/training/calculations/calories';
import { useProfile } from '@/features/profile';
import {
  activityFormSchema,
  activityTypeLabels,
  activityTypeOptions,
  calculationModeLabels,
  calculationModeOptions,
  effortLevelLabel,
  hikingEffortOptions,
  strengthEffortOptions,
  type ActivityFormValues,
  type EffortLevel,
} from '@/features/training/schema';
import { useTheme } from '@/hooks/use-theme';

export type ActivityFormProps = {
  defaultValues: Partial<ActivityFormValues>;
  userId: string | undefined;
  onSubmit: (values: ActivityFormValues) => void;
  submitLabel?: string;
  submitting?: boolean;
  footer?: ReactNode;
};

export function ActivityForm({ defaultValues, userId, onSubmit, submitLabel = 'Guardar', submitting, footer }: ActivityFormProps) {
  const theme = useTheme();
  const { data: profile } = useProfile(userId);
  const weightKg = profile?.weight_kg ?? null;

  const { control, handleSubmit } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activity_type: 'strength',
      calculation_mode: weightKg == null ? 'manual' : 'auto',
      save_as_template: false,
      ...defaultValues,
    },
  });
  // See BasicInfoStep.tsx for why this must be `useFormState`, not `formState` destructured off `useForm()`.
  const { errors } = useFormState({ control });
  const watched = useWatch({ control });

  const activityType = watched.activity_type ?? 'strength';
  const calculationMode = watched.calculation_mode ?? 'auto';
  const effortOptions = activityType === 'strength' ? strengthEffortOptions : hikingEffortOptions;

  const met =
    calculationMode === 'auto'
      ? resolveMet(activityType, {
          effortLevel: watched.effort_level,
          distanceKm: watched.distance_km,
          durationMinutes: watched.duration_minutes,
        })
      : null;
  const preview = met !== null && weightKg != null && watched.duration_minutes ? calculateActivityCalories(met, weightKg, watched.duration_minutes) : null;

  const calculationModeOptionList = calculationModeOptions
    .filter((value) => value !== 'auto' || weightKg != null)
    .map((value) => ({ value, label: calculationModeLabels[value] }));

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="activity_type"
        render={({ field }) => (
          <OptionPicker
            label="Tipo de actividad"
            options={activityTypeOptions.map((value) => ({ value, label: activityTypeLabels[value] }))}
            value={field.value}
            onChange={field.onChange}
            error={errors.activity_type?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="calculation_mode"
        render={({ field }) => (
          <OptionPicker
            label="Cálculo del gasto"
            options={calculationModeOptionList}
            value={field.value}
            onChange={field.onChange}
            error={errors.calculation_mode?.message}
          />
        )}
      />
      {weightKg == null ? (
        <ThemedText type="small" themeColor="textSecondary">
          Añade tu peso en tu perfil para poder calcular el gasto automáticamente.
        </ThemedText>
      ) : null}

      {calculationMode === 'manual' ? (
        <Controller
          control={control}
          name="manual_calories_burned"
          render={({ field }) => (
            <NumericField
              label="Calorías quemadas"
              suffix="kcal"
              value={field.value}
              onChangeNumber={field.onChange}
              error={errors.manual_calories_burned?.message}
            />
          )}
        />
      ) : (
        <>
          {activityType === 'running' ? (
            <Controller
              control={control}
              name="distance_km"
              render={({ field }) => (
                <NumericField
                  label="Distancia"
                  suffix="km"
                  value={field.value}
                  onChangeNumber={field.onChange}
                  error={errors.distance_km?.message}
                />
              )}
            />
          ) : (
            <Controller
              control={control}
              name="effort_level"
              render={({ field }) => (
                <OptionPicker
                  label="Intensidad"
                  options={effortOptions.map((value) => ({ value, label: effortLevelLabel(activityType, value as EffortLevel) }))}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.effort_level?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="duration_minutes"
            render={({ field }) => (
              <NumericField
                label="Minutos de actividad"
                suffix="min"
                value={field.value}
                onChangeNumber={field.onChange}
                error={errors.duration_minutes?.message}
              />
            )}
          />

          <ThemedText type="small" themeColor="textSecondary">
            {preview !== null ? `Calorías estimadas: ${Math.round(preview * 10) / 10} kcal` : 'Completa los datos para ver la estimación.'}
          </ThemedText>
        </>
      )}

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField label="Nombre (opcional)" value={field.value ?? ''} onChangeText={field.onChange} onBlur={field.onBlur} />
        )}
      />

      <Controller
        control={control}
        name="save_as_template"
        render={({ field }) => (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: field.value }}
            style={styles.checkboxRow}
            onPress={() => field.onChange(!field.value)}>
            <View
              style={[
                styles.checkbox,
                { borderColor: theme.border, backgroundColor: field.value ? theme.accentSecondary : 'transparent' },
              ]}>
              {field.value ? <Ionicons name="checkmark" size={14} color={theme.text} /> : null}
            </View>
            <ThemedText type="default">Guardar este entreno para reutilizarlo</ThemedText>
          </Pressable>
        )}
      />

      <Button title={submitLabel} onPress={handleSubmit(onSubmit)} loading={submitting} />

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
