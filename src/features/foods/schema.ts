import { z } from 'zod';

export const servingTypeOptions = ['per_100g', 'per_unit'] as const;
export const servingTypeLabels: Record<(typeof servingTypeOptions)[number], string> = {
  per_100g: '100 g',
  per_unit: 'Unidad',
};

export const foodCategoryOptions = [
  'fruit',
  'vegetable',
  'fish',
  'meat',
  'grains_pasta',
  'nuts',
  'sweets',
  'beverages',
  'supplements',
  'other',
] as const;

export const foodCategoryLabels: Record<(typeof foodCategoryOptions)[number], string> = {
  fruit: 'Fruta',
  vegetable: 'Verdura',
  fish: 'Pescado',
  meat: 'Carne',
  grains_pasta: 'Cereales y Pastas',
  nuts: 'Frutos Secos',
  sweets: 'Dulces',
  beverages: 'Bebidas',
  supplements: 'Suplementos',
  other: 'Otros',
};

const optionalNonNegative = (max: number) => z.number().min(0).max(max).optional();

export const foodFormSchema = z.object({
  name: z.string({ message: 'Indica un nombre' }).trim().min(1, 'Indica un nombre').max(120),
  serving_type: z.enum(servingTypeOptions, { message: 'Selecciona el tipo de ración' }),
  category: z.enum(foodCategoryOptions, { message: 'Selecciona una categoría' }),

  // required core macros
  energy_kcal: z.number({ message: 'Indica la energía' }).min(0).max(9999),
  fat_g: z.number({ message: 'Indica la grasa' }).min(0).max(999),
  protein_g: z.number({ message: 'Indica la proteína' }).min(0).max(999),
  carbs_g: z.number({ message: 'Indica los carbohidratos' }).min(0).max(999),

  // optional fat detail
  saturated_fat_g: optionalNonNegative(999),
  monounsaturated_fat_g: optionalNonNegative(999),
  polyunsaturated_fat_g: optionalNonNegative(999),

  // optional other macros / misc
  fiber_g: optionalNonNegative(999),
  sugar_g: optionalNonNegative(999),
  salt_g: optionalNonNegative(999),
  omega3_g: optionalNonNegative(999),
  cholesterol_mg: optionalNonNegative(99999),
  caffeine_mg: optionalNonNegative(99999),

  // optional vitamins
  vitamin_c_mg: optionalNonNegative(99999),
  vitamin_a_mcg: optionalNonNegative(999999),
  vitamin_d_mcg: optionalNonNegative(999999),
  vitamin_e_mcg: optionalNonNegative(999999),
  vitamin_k_mcg: optionalNonNegative(999999),
  vitamin_b1_mg: optionalNonNegative(99999),
  vitamin_b2_mg: optionalNonNegative(99999),
  vitamin_b3_mg: optionalNonNegative(99999),
  vitamin_b5_mg: optionalNonNegative(99999),
  vitamin_b6_mg: optionalNonNegative(99999),
  vitamin_b7_mcg: optionalNonNegative(999999),
  vitamin_b8_mcg: optionalNonNegative(999999),
  vitamin_b12_mcg: optionalNonNegative(999999),

  // optional minerals
  calcium_mg: optionalNonNegative(99999),
  iron_mg: optionalNonNegative(99999),
  magnesium_mg: optionalNonNegative(99999),
  phosphorus_mg: optionalNonNegative(99999),
  potassium_mg: optionalNonNegative(99999),
  sodium_mg: optionalNonNegative(99999),
  zinc_mg: optionalNonNegative(99999),
});

export type FoodFormValues = z.infer<typeof foodFormSchema>;
