import { calculateActivityCalories, resolveMet } from '@/features/training/calculations/calories';
import type { ActivityFormValues, EffortLevel } from '@/features/training/schema';
import type { Tables, TablesInsert } from '@/lib/supabase/database.types';

export function toFormDefaults(activity: Tables<'calendar_activities'>): Partial<ActivityFormValues> {
  return {
    activity_type: activity.activity_type,
    calculation_mode: activity.calculation_mode,
    name: activity.name ?? '',
    save_as_template: false,
    duration_minutes: activity.duration_minutes ?? undefined,
    distance_km: activity.distance_km ?? undefined,
    effort_level: (activity.effort_level as EffortLevel | null) ?? undefined,
    manual_calories_burned: activity.calculation_mode === 'manual' ? activity.calories_burned : undefined,
  };
}

export type ResolvedActivity = {
  calories_burned: number;
  met_value: number | null;
  weight_kg_used: number | null;
};

/**
 * Turns validated form values into the fields that actually get stored —
 * the one place that decides "auto: compute it" vs "manual: trust the
 * number the user typed". `weightKg` is the profile's *current* weight,
 * always passed in fresh rather than cached, so a stale value never sneaks
 * into a calculation.
 */
export function resolveActivityCalories(values: ActivityFormValues, weightKg: number | null): ResolvedActivity {
  if (values.calculation_mode === 'manual') {
    return { calories_burned: values.manual_calories_burned as number, met_value: null, weight_kg_used: null };
  }

  if (weightKg == null) {
    throw new Error('Añade tu peso en tu perfil para calcular el gasto automáticamente.');
  }
  const met = resolveMet(values.activity_type, {
    effortLevel: values.effort_level,
    distanceKm: values.distance_km,
    durationMinutes: values.duration_minutes,
  });
  if (met === null || !values.duration_minutes) {
    throw new Error('Faltan datos para calcular el gasto de esta actividad.');
  }
  const calories = calculateActivityCalories(met, weightKg, values.duration_minutes);
  return {
    calories_burned: Math.round(calories * 10) / 10,
    met_value: Math.round(met * 100) / 100,
    weight_kg_used: weightKg,
  };
}

export function buildActivityInsert(
  values: ActivityFormValues,
  context: { userId: string; date: string },
  resolved: ResolvedActivity,
): TablesInsert<'calendar_activities'> {
  return {
    user_id: context.userId,
    date: context.date,
    activity_type: values.activity_type,
    name: values.name?.trim() ? values.name.trim() : null,
    calculation_mode: values.calculation_mode,
    calories_burned: resolved.calories_burned,
    duration_minutes: values.calculation_mode === 'auto' ? (values.duration_minutes as number) : null,
    distance_km: values.calculation_mode === 'auto' && values.activity_type === 'running' ? (values.distance_km as number) : null,
    effort_level: values.calculation_mode === 'auto' && values.activity_type !== 'running' ? (values.effort_level as EffortLevel) : null,
    met_value: resolved.met_value,
    weight_kg_used: resolved.weight_kg_used,
  };
}

export function buildSavedActivityInsert(
  values: ActivityFormValues,
  context: { userId: string },
  resolved: ResolvedActivity,
): TablesInsert<'saved_activities'> {
  return {
    user_id: context.userId,
    name: values.name?.trim() ? values.name.trim() : 'Entreno guardado',
    activity_type: values.activity_type,
    calculation_mode: values.calculation_mode,
    calories_burned: resolved.calories_burned,
    duration_minutes: values.calculation_mode === 'auto' ? (values.duration_minutes as number) : null,
    distance_km: values.calculation_mode === 'auto' && values.activity_type === 'running' ? (values.distance_km as number) : null,
    effort_level: values.calculation_mode === 'auto' && values.activity_type !== 'running' ? (values.effort_level as EffortLevel) : null,
  };
}
