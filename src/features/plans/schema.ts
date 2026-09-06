import { z } from 'zod';

export const planTypeOptions = ['standard', 'special'] as const;

export const planTypeLabels: Record<(typeof planTypeOptions)[number], string> = {
  standard: 'Estándar',
  special: 'Especial',
};

export const planFormSchema = z
  .object({
    name: z.string({ message: 'Indica un nombre' }).trim().min(1, 'Indica un nombre').max(120),
    type: z.enum(planTypeOptions, { message: 'Selecciona un tipo de plan' }),
    calories_target: z.number().int().min(800, 'Mínimo 800 kcal').max(6000, 'Máximo 6000 kcal').optional(),
    protein_g_target: z.number().min(0).max(600).optional(),
    carbs_g_target: z.number().min(0).max(900).optional(),
    fat_g_target: z.number().min(0).max(400).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== 'special') return;

    if (data.calories_target === undefined) {
      ctx.addIssue({ code: 'custom', path: ['calories_target'], message: 'Indica las kcal objetivo' });
    }
    if (data.protein_g_target === undefined) {
      ctx.addIssue({ code: 'custom', path: ['protein_g_target'], message: 'Indica la proteína objetivo' });
    }
    if (data.carbs_g_target === undefined) {
      ctx.addIssue({ code: 'custom', path: ['carbs_g_target'], message: 'Indica los carbohidratos objetivo' });
    }
    if (data.fat_g_target === undefined) {
      ctx.addIssue({ code: 'custom', path: ['fat_g_target'], message: 'Indica la grasa objetivo' });
    }
  });

export type PlanFormValues = z.infer<typeof planFormSchema>;

/** Pure validity check for an inline quantity edit — no per-row RHF instance needed. */
export function isValidPlanItemFoodQuantity(quantity: number, servingType: 'per_100g' | 'per_unit'): boolean {
  if (!(quantity > 0)) return false;
  return servingType === 'per_unit' ? Number.isInteger(quantity) : true;
}
