import { z } from 'zod';

export const sexOptions = ['male', 'female'] as const;
export const goalOptions = ['lose', 'maintain', 'gain'] as const;

export const sexLabels: Record<(typeof sexOptions)[number], string> = {
  male: 'Hombre',
  female: 'Mujer',
};

export const goalLabels: Record<(typeof goalOptions)[number], string> = {
  lose: 'Perder peso',
  maintain: 'Mantener peso',
  gain: 'Ganar peso',
};

/**
 * One schema for the whole personalization form (basic info + goal + macros),
 * shared by the onboarding wizard (stepped) and the Cuenta screen (single
 * page) so both stay validated identically.
 */
export const profileFormSchema = z
  .object({
    age: z.number({ message: 'Indica tu edad' }).int().min(10, 'Edad mínima: 10').max(100, 'Edad máxima: 100'),
    height_cm: z
      .number({ message: 'Indica tu altura' })
      .min(100, 'Altura mínima: 100 cm')
      .max(250, 'Altura máxima: 250 cm'),
    weight_kg: z
      .number({ message: 'Indica tu peso' })
      .min(30, 'Peso mínimo: 30 kg')
      .max(300, 'Peso máximo: 300 kg'),
    sex: z.enum(sexOptions, { message: 'Selecciona tu sexo' }),
    body_fat_pct: z.number().min(3, 'Mínimo 3%').max(70, 'Máximo 70%').optional(),
    goal: z.enum(goalOptions, { message: 'Selecciona un objetivo' }),
    target_weight_kg: z.number().min(30, 'Peso mínimo: 30 kg').max(300, 'Peso máximo: 300 kg').optional(),
    pace_kg_per_week: z.number().min(0.1).max(0.7).optional(),
    calories_target: z.number({ message: 'Indica las kcal objetivo' }).int().min(800, 'Mínimo 800 kcal').max(6000, 'Máximo 6000 kcal'),
    protein_g_target: z.number({ message: 'Indica la proteína objetivo' }).min(0).max(600),
    carbs_g_target: z.number({ message: 'Indica los carbohidratos objetivo' }).min(0).max(900),
    fat_g_target: z.number({ message: 'Indica la grasa objetivo' }).min(0).max(400),
  })
  .superRefine((data, ctx) => {
    if (data.goal === 'maintain') return;

    if (data.target_weight_kg === undefined) {
      ctx.addIssue({ code: 'custom', path: ['target_weight_kg'], message: 'Indica tu peso objetivo' });
    }
    if (data.pace_kg_per_week === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['pace_kg_per_week'],
        message: 'Elige un ritmo entre 0,1 y 0,7 kg/semana',
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/** Fields required before macros can be computed for the live preview. */
export type MacroInputFields = Pick<ProfileFormValues, 'age' | 'height_cm' | 'weight_kg' | 'sex' | 'goal' | 'pace_kg_per_week'>;

export function hasMacroInputs(values: Partial<ProfileFormValues>): values is MacroInputFields {
  return (
    typeof values.age === 'number' &&
    typeof values.height_cm === 'number' &&
    typeof values.weight_kg === 'number' &&
    !!values.sex &&
    !!values.goal
  );
}
