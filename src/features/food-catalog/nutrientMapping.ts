import type { OptionalNutrientField } from '@/features/foods/schema';

/**
 * USDA nutrient_nbr → `foods` column mapping, verified against the real
 * downloaded nutrient.csv (Foundation Foods + SR Legacy), not guessed.
 * Anything with no direct USDA equivalent is simply absent from this map
 * and stays null on the copy — never derived/estimated (e.g. `salt_g`
 * would need a sodium→salt conversion the user never asked for, and
 * `omega3_g` has no single USDA total, only individual fatty acids).
 */
export const REQUIRED_NUTRIENT_NBR = {
  protein_g: '203',
  fat_g: '204',
  carbs_g: '205',
} as const;

/**
 * Energy has no single nutrient_nbr USDA always reports — this is the
 * priority order to pick whichever is actually present. 268 is in kJ and
 * gets converted to kcal (a unit conversion of a real value, not an
 * estimate). 957/958 are Atwater-factor energy values USDA itself already
 * computed and published — using one of those isn't inventing a number,
 * it's choosing which already-sourced number to use.
 */
export const ENERGY_NUTRIENT_PRIORITY: { nbr: string; unit: 'KCAL' | 'kJ' }[] = [
  { nbr: '208', unit: 'KCAL' },
  { nbr: '268', unit: 'kJ' },
  { nbr: '957', unit: 'KCAL' },
  { nbr: '958', unit: 'KCAL' },
];

const KCAL_PER_KJ = 1 / 4.184;

export const OPTIONAL_NUTRIENT_NBR: Partial<Record<OptionalNutrientField, string>> = {
  saturated_fat_g: '606',
  monounsaturated_fat_g: '645',
  polyunsaturated_fat_g: '646',
  fiber_g: '291',
  sugar_g: '269',
  cholesterol_mg: '601',
  caffeine_mg: '262',
  vitamin_c_mg: '401',
  vitamin_a_mcg: '320',
  vitamin_d_mcg: '328',
  vitamin_e_mcg: '323',
  vitamin_k_mcg: '430',
  vitamin_b1_mg: '404',
  vitamin_b2_mg: '405',
  vitamin_b3_mg: '406',
  vitamin_b5_mg: '410',
  vitamin_b6_mg: '415',
  vitamin_b7_mcg: '416',
  vitamin_b12_mcg: '418',
  calcium_mg: '301',
  iron_mg: '303',
  magnesium_mg: '304',
  phosphorus_mg: '305',
  potassium_mg: '306',
  sodium_mg: '307',
  zinc_mg: '309',
};

export type ReferenceNutrientAmount = { nutrientNbr: string; amount: number };

export type CoreMacroValues = {
  energy_kcal: number | null;
  protein_g: number | null;
  fat_g: number | null;
  carbs_g: number | null;
};

export type BuildFoodValuesResult = {
  core: CoreMacroValues;
  optional: Partial<Record<OptionalNutrientField, number>>;
  /** True only when every column `foods` requires (not null) has a real, sourced value — never a fabricated one. */
  canMaterialize: boolean;
  missingFields: (keyof CoreMacroValues)[];
};

/**
 * Resolves the 4 required macros (nullable — for display, where a partial
 * result is still useful) plus every optional nutrient this catalog food
 * has a real value for, and whether it has everything `foods` requires to
 * be copied at all. Never fabricates a missing required value — see
 * PROGRESS.md for why ~92 Foundation Foods (out of 6,447 catalog foods)
 * can't be materialized.
 */
export function buildFoodValues(rows: ReferenceNutrientAmount[]): BuildFoodValuesResult {
  const byNbr = new Map(rows.map((r) => [r.nutrientNbr, r.amount]));

  const proteinG = byNbr.get(REQUIRED_NUTRIENT_NBR.protein_g);
  const fatG = byNbr.get(REQUIRED_NUTRIENT_NBR.fat_g);
  const carbsG = byNbr.get(REQUIRED_NUTRIENT_NBR.carbs_g);

  let energyKcal: number | undefined;
  for (const { nbr, unit } of ENERGY_NUTRIENT_PRIORITY) {
    const amount = byNbr.get(nbr);
    if (amount !== undefined) {
      energyKcal = unit === 'kJ' ? amount * KCAL_PER_KJ : amount;
      break;
    }
  }

  const core: CoreMacroValues = {
    energy_kcal: energyKcal ?? null,
    protein_g: proteinG ?? null,
    fat_g: fatG ?? null,
    carbs_g: carbsG ?? null,
  };

  const missingFields = (Object.keys(core) as (keyof CoreMacroValues)[]).filter((field) => core[field] === null);

  const optional: Partial<Record<OptionalNutrientField, number>> = {};
  for (const [field, nbr] of Object.entries(OPTIONAL_NUTRIENT_NBR) as [OptionalNutrientField, string][]) {
    const amount = byNbr.get(nbr);
    if (amount !== undefined) optional[field] = amount;
  }

  return { core, optional, canMaterialize: missingFields.length === 0, missingFields };
}

export type MaterializedFoodValues = {
  energy_kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
} & Partial<Record<OptionalNutrientField, number>>;

export type MaterializationResult =
  | { canMaterialize: true; values: MaterializedFoodValues }
  | { canMaterialize: false; missingFields: (keyof CoreMacroValues)[] };

/** Same resolution as `buildFoodValues`, narrowed to the shape `createFood` needs — used only by the actual copy mutation. */
export function buildMaterializedFoodValues(rows: ReferenceNutrientAmount[]): MaterializationResult {
  const { core, optional, canMaterialize, missingFields } = buildFoodValues(rows);

  if (!canMaterialize || core.energy_kcal === null || core.protein_g === null || core.fat_g === null || core.carbs_g === null) {
    return { canMaterialize: false, missingFields };
  }

  return {
    canMaterialize: true,
    values: {
      energy_kcal: core.energy_kcal,
      protein_g: core.protein_g,
      fat_g: core.fat_g,
      carbs_g: core.carbs_g,
      ...optional,
    },
  };
}
