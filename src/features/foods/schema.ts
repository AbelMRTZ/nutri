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

/**
 * The optional nutrient fields, in one place, so the food form and the
 * Comidas "nutrient chips" visualization share a single source of truth
 * for field names/labels/units instead of two hand-maintained lists.
 */
export const optionalNutrientFields = [
  'saturated_fat_g',
  'monounsaturated_fat_g',
  'polyunsaturated_fat_g',
  'fiber_g',
  'sugar_g',
  'salt_g',
  'omega3_g',
  'cholesterol_mg',
  'caffeine_mg',
  'vitamin_c_mg',
  'vitamin_a_mcg',
  'vitamin_d_mcg',
  'vitamin_e_mcg',
  'vitamin_k_mcg',
  'vitamin_b1_mg',
  'vitamin_b2_mg',
  'vitamin_b3_mg',
  'vitamin_b5_mg',
  'vitamin_b6_mg',
  'vitamin_b7_mcg',
  'vitamin_b8_mcg',
  'vitamin_b12_mcg',
  'calcium_mg',
  'iron_mg',
  'magnesium_mg',
  'phosphorus_mg',
  'potassium_mg',
  'sodium_mg',
  'zinc_mg',
] as const;

export type OptionalNutrientField = (typeof optionalNutrientFields)[number];

export const nutrientLabels: Record<OptionalNutrientField, { label: string; unit: string }> = {
  saturated_fat_g: { label: 'Saturada', unit: 'g' },
  monounsaturated_fat_g: { label: 'Monoinsaturada', unit: 'g' },
  polyunsaturated_fat_g: { label: 'Poliinsaturada', unit: 'g' },
  fiber_g: { label: 'Fibra', unit: 'g' },
  sugar_g: { label: 'Azúcar', unit: 'g' },
  salt_g: { label: 'Sal', unit: 'g' },
  omega3_g: { label: 'Omega-3', unit: 'g' },
  cholesterol_mg: { label: 'Colesterol', unit: 'mg' },
  caffeine_mg: { label: 'Cafeína', unit: 'mg' },
  vitamin_c_mg: { label: 'Vitamina C', unit: 'mg' },
  vitamin_a_mcg: { label: 'Vitamina A', unit: 'mcg' },
  vitamin_d_mcg: { label: 'Vitamina D', unit: 'mcg' },
  vitamin_e_mcg: { label: 'Vitamina E', unit: 'mcg' },
  vitamin_k_mcg: { label: 'Vitamina K', unit: 'mcg' },
  vitamin_b1_mg: { label: 'B1', unit: 'mg' },
  vitamin_b2_mg: { label: 'B2', unit: 'mg' },
  vitamin_b3_mg: { label: 'B3', unit: 'mg' },
  vitamin_b5_mg: { label: 'B5', unit: 'mg' },
  vitamin_b6_mg: { label: 'B6', unit: 'mg' },
  vitamin_b7_mcg: { label: 'B7', unit: 'mcg' },
  vitamin_b8_mcg: { label: 'B8', unit: 'mcg' },
  vitamin_b12_mcg: { label: 'B12', unit: 'mcg' },
  calcium_mg: { label: 'Calcio', unit: 'mg' },
  iron_mg: { label: 'Hierro', unit: 'mg' },
  magnesium_mg: { label: 'Magnesio', unit: 'mg' },
  phosphorus_mg: { label: 'Fósforo', unit: 'mg' },
  potassium_mg: { label: 'Potasio', unit: 'mg' },
  sodium_mg: { label: 'Sodio', unit: 'mg' },
  zinc_mg: { label: 'Zinc', unit: 'mg' },
};
