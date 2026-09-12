import { z } from 'zod';

export const activityTypeOptions = ['strength', 'running', 'hiking'] as const;
export type ActivityType = (typeof activityTypeOptions)[number];
export const activityTypeLabels: Record<ActivityType, string> = {
  strength: 'Fuerza',
  running: 'Carrera',
  hiking: 'Senderismo',
};

export const calculationModeOptions = ['auto', 'manual'] as const;
export type CalculationMode = (typeof calculationModeOptions)[number];
export const calculationModeLabels: Record<CalculationMode, string> = {
  auto: 'Automático',
  manual: 'Manual',
};

export const strengthEffortOptions = ['light', 'moderate', 'intense'] as const;
export type StrengthEffort = (typeof strengthEffortOptions)[number];
export const strengthEffortLabels: Record<StrengthEffort, string> = {
  light: 'Fuerza Ligera',
  moderate: 'Fuerza Moderada',
  intense: 'Fuerza Intensa',
};

export const hikingEffortOptions = ['easy', 'moderate', 'demanding', 'trail'] as const;
export type HikingEffort = (typeof hikingEffortOptions)[number];
export const hikingEffortLabels: Record<HikingEffort, string> = {
  easy: 'Senderismo Fácil',
  moderate: 'Senderismo Moderado',
  demanding: 'Senderismo Exigente',
  trail: 'Trail',
};

/**
 * The DB enum (`activity_effort_level`) shares 'moderate' between Fuerza and
 * Senderismo, but its meaning (and MET) always depends on which activity_type
 * it's attached to — never resolved from the raw value alone.
 */
export type EffortLevel = StrengthEffort | HikingEffort;

export function effortLevelLabel(activityType: ActivityType, effort: EffortLevel): string {
  if (activityType === 'strength') return strengthEffortLabels[effort as StrengthEffort];
  if (activityType === 'hiking') return hikingEffortLabels[effort as HikingEffort];
  return effort;
}

const allEffortLevels = [...strengthEffortOptions, ...hikingEffortOptions] as [EffortLevel, ...EffortLevel[]];

export const activityFormSchema = z
  .object({
    activity_type: z.enum(activityTypeOptions, { message: 'Selecciona un tipo de actividad' }),
    calculation_mode: z.enum(calculationModeOptions, { message: 'Selecciona cómo calcular el gasto' }),
    name: z.string().trim().max(120).optional(),
    save_as_template: z.boolean(),

    // Auto-calculation inputs — which ones are required depends on
    // activity_type/calculation_mode, enforced below via superRefine.
    duration_minutes: z.number().min(1, 'Mínimo 1 minuto').max(600, 'Máximo 600 minutos').optional(),
    distance_km: z.number().min(0.1, 'Mínimo 0,1 km').max(200, 'Máximo 200 km').optional(),
    effort_level: z.enum(allEffortLevels).optional(),

    // Manual-mode input.
    manual_calories_burned: z.number().min(0).max(9999).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.calculation_mode === 'manual') {
      if (data.manual_calories_burned === undefined) {
        ctx.addIssue({ code: 'custom', path: ['manual_calories_burned'], message: 'Indica las calorías quemadas' });
      }
      return;
    }

    if (data.duration_minutes === undefined) {
      ctx.addIssue({ code: 'custom', path: ['duration_minutes'], message: 'Indica los minutos de actividad' });
    }
    if (data.activity_type === 'running') {
      if (data.distance_km === undefined) {
        ctx.addIssue({ code: 'custom', path: ['distance_km'], message: 'Indica la distancia' });
      }
    } else if (data.effort_level === undefined) {
      ctx.addIssue({ code: 'custom', path: ['effort_level'], message: 'Selecciona la intensidad' });
    }
  });

export type ActivityFormValues = z.infer<typeof activityFormSchema>;
