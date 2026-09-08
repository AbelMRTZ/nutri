import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { calculateDefaultMacros } from '@/features/profile/calculations/macros';
import { calculateCaloriesTarget } from '@/features/profile/calculations/tdee';
import { BasicInfoStep } from '@/features/profile/components/steps/BasicInfoStep';
import { GoalStep } from '@/features/profile/components/steps/GoalStep';
import { MacrosReviewStep } from '@/features/profile/components/steps/MacrosReviewStep';
import { profileFormSchema, type ProfileFormValues } from '@/features/profile/schema';

export type ProfileSubmitValues = ProfileFormValues & { macros_auto_calculated: boolean };

export type ProfileFormProps = {
  mode: 'onboarding' | 'edit';
  defaultValues: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileSubmitValues) => void;
  submitLabel?: string;
  submitting?: boolean;
};

const STEPS: { key: string; title: string; fields: (keyof ProfileFormValues)[]; Component: () => React.JSX.Element }[] = [
  { key: 'basic', title: 'Datos básicos', fields: ['age', 'height_cm', 'weight_kg', 'sex', 'body_fat_pct'], Component: BasicInfoStep },
  { key: 'goal', title: 'Objetivo', fields: ['goal', 'target_weight_kg', 'pace_kg_per_week'], Component: GoalStep },
  {
    key: 'macros',
    title: 'Calorías y macros',
    fields: ['calories_target', 'protein_g_target', 'carbs_g_target', 'fat_g_target'],
    Component: MacrosReviewStep,
  },
];

function withAutoCalculatedFlag(values: ProfileFormValues): ProfileSubmitValues {
  // `values` has already passed zod validation, so every field required by
  // the calculation (age/height/weight/sex/goal) is guaranteed to be set.
  const suggestedCalories = calculateCaloriesTarget(values);
  const suggestedMacros = calculateDefaultMacros(suggestedCalories, values.weight_kg);

  const macros_auto_calculated =
    suggestedCalories === values.calories_target &&
    suggestedMacros.protein_g_target === values.protein_g_target &&
    suggestedMacros.carbs_g_target === values.carbs_g_target &&
    suggestedMacros.fat_g_target === values.fat_g_target;

  return { ...values, macros_auto_calculated };
}

export function ProfileForm({ mode, defaultValues, onSubmit, submitLabel, submitting }: ProfileFormProps) {
  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });
  const [stepIndex, setStepIndex] = useState(0);

  const submit = methods.handleSubmit((values) => onSubmit(withAutoCalculatedFlag(values)));

  if (mode === 'edit') {
    return (
      <FormProvider {...methods}>
        <View style={styles.container}>
          <BasicInfoStep />
          <GoalStep />
          <MacrosReviewStep />
          <Button title={submitLabel ?? 'Guardar cambios'} onPress={submit} loading={submitting} />
        </View>
      </FormProvider>
    );
  }

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  async function handleNext() {
    const valid = await methods.trigger(step.fields);
    if (!valid) return;

    if (isLastStep) {
      await submit();
    } else {
      setStepIndex((current) => current + 1);
    }
  }

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.stepHeader}>
          <ThemedText type="small" themeColor="textSecondary">
            Paso {stepIndex + 1} de {STEPS.length}
          </ThemedText>
          <ThemedText type="subtitle">{step.title}</ThemedText>
        </View>

        {/*
          Every step stays mounted the whole time — only the active one is
          visible (`display: none` on the rest) — instead of conditionally
          rendering just `step.Component`. Unmounting/remounting a step's
          Controllers on Atrás/Siguiente hit a react-hook-form quirk: after
          a Controller re-registers post-remount, sending it a genuinely
          empty value (`onChange(undefined)`) got silently replaced with
          the value from before the remount instead of actually clearing,
          so a field like "21" could never be fully erased once you'd left
          and returned to its step. Keeping every step's Controllers
          mounted the entire time (matching how `mode: 'edit'` already
          renders all three at once with no such bug) sidesteps that
          re-registration path entirely.
        */}
        {STEPS.map((s, index) => (
          <View key={s.key} style={index === stepIndex ? undefined : styles.hiddenStep}>
            <s.Component />
          </View>
        ))}

        <View style={styles.buttonsRow}>
          {stepIndex > 0 ? (
            <Button
              variant="secondary"
              title="Atrás"
              style={styles.flexButton}
              onPress={() => setStepIndex((current) => current - 1)}
            />
          ) : null}
          <Button
            title={isLastStep ? (submitLabel ?? 'Completar registro') : 'Siguiente'}
            style={styles.flexButton}
            onPress={handleNext}
            loading={submitting}
          />
        </View>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  hiddenStep: {
    display: 'none',
  },
  stepHeader: {
    gap: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});
