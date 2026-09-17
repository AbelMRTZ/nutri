import { z } from 'zod';

export const mealCategoryOptions = ['main', 'breakfast', 'pre_workout', 'post_workout', 'snack'] as const;

export type MealCategory = (typeof mealCategoryOptions)[number];

export const mealCategoryLabels: Record<MealCategory, string> = {
  main: 'Principal',
  breakfast: 'Desayuno',
  pre_workout: 'Preentreno',
  post_workout: 'Postentreno',
  snack: 'Tentempié',
};

export const mealFormSchema = z.object({
  name: z.string({ message: 'Indica un nombre' }).trim().min(1, 'Indica un nombre').max(120),
  category: z.enum(mealCategoryOptions, { message: 'Selecciona una categoría' }),
  recipe_url: z
    .string()
    .trim()
    .max(2048, 'El enlace es demasiado largo')
    .optional()
    .refine((value) => !value || /^https?:\/\//i.test(value), {
      message: 'El enlace debe empezar por http:// o https://',
    }),
});

export type MealFormValues = z.infer<typeof mealFormSchema>;

/** UI-facing choice; mapped to the DB's plain `is_variable` boolean at submit time. */
export const mealItemFlexibilityOptions = ['invariable', 'variable'] as const;

export const mealItemFlexibilityLabels: Record<(typeof mealItemFlexibilityOptions)[number], string> = {
  invariable: 'Invariable',
  variable: 'Variable',
};

/**
 * Built per-render from the target food's serving_type: a per_unit food's
 * quantity must be a whole number, a per_100g food's need not be.
 */
export function mealItemFormSchema(servingType: 'per_100g' | 'per_unit') {
  const quantity =
    servingType === 'per_unit'
      ? z
          .number({ message: 'Indica la cantidad' })
          .int('Debe ser un número entero de unidades')
          .positive('La cantidad debe ser mayor que 0')
      : z.number({ message: 'Indica la cantidad' }).positive('La cantidad debe ser mayor que 0');

  return z.object({
    quantity,
    flexibility: z.enum(mealItemFlexibilityOptions, { message: 'Selecciona si es invariable o variable' }),
  });
}

export type MealItemFormValues = z.infer<ReturnType<typeof mealItemFormSchema>>;
