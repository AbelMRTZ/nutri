import type { FoodCategory } from '../../src/features/foods/schema';

/**
 * USDA's own ~28 food groups (food_category.description, identical across
 * Foundation Foods and SR Legacy) mapped onto the app's `food_category`
 * enum. Explicit and exhaustive so nothing falls into 'other' silently —
 * anything not listed here is treated as unmapped and logged, not guessed.
 *
 * 'EXCLUDED' marks USDA categories that are inherently prepared dishes,
 * brand-tied, or too regionally specific to count as universal basic
 * ingredients (per the user's explicit condition on this catalog) — these
 * foods are dropped before any name-level brand filtering even runs.
 */
export const USDA_CATEGORY_MAP: Record<string, FoodCategory | 'EXCLUDED'> = {
  'Dairy and Egg Products': 'dairy',
  'Spices and Herbs': 'other',
  'Baby Foods': 'EXCLUDED',
  'Fats and Oils': 'oils_fats',
  'Poultry Products': 'meat',
  'Soups, Sauces, and Gravies': 'EXCLUDED',
  'Sausages and Luncheon Meats': 'meat',
  'Breakfast Cereals': 'grains_pasta',
  'Fruits and Fruit Juices': 'fruit',
  'Pork Products': 'meat',
  'Vegetables and Vegetable Products': 'vegetable',
  'Nut and Seed Products': 'nuts',
  'Beef Products': 'meat',
  Beverages: 'beverages',
  'Finfish and Shellfish Products': 'fish',
  'Legumes and Legume Products': 'legumes',
  'Lamb, Veal, and Game Products': 'meat',
  'Baked Products': 'grains_pasta',
  Sweets: 'sweets',
  'Cereal Grains and Pasta': 'grains_pasta',
  'Fast Foods': 'EXCLUDED',
  'Meals, Entrees, and Side Dishes': 'EXCLUDED',
  Snacks: 'EXCLUDED',
  'American Indian/Alaska Native Foods': 'EXCLUDED',
  'Restaurant Foods': 'EXCLUDED',
  'Branded Food Products Database': 'EXCLUDED', // defensive — this data_type is never downloaded anyway
  'Quality Control Materials': 'EXCLUDED',
  'Alcoholic Beverages': 'EXCLUDED',
};

export type CategoryMapping =
  | { kind: 'excluded' }
  | { kind: 'mapped'; category: FoodCategory }
  | { kind: 'unmapped' };

export function mapUsdaCategory(usdaCategoryDescription: string): CategoryMapping {
  const mapped = USDA_CATEGORY_MAP[usdaCategoryDescription];
  if (mapped === undefined) return { kind: 'unmapped' };
  if (mapped === 'EXCLUDED') return { kind: 'excluded' };
  return { kind: 'mapped', category: mapped };
}
