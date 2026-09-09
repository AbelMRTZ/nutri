import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'csv-parse/sync';

import type {
  UsdaFoodCategoryRow,
  UsdaFoodNutrientDerivationRow,
  UsdaFoodNutrientRow,
  UsdaFoodRow,
  UsdaNutrientRow,
} from './types';

function readCsv<T>(path: string): T[] {
  const content = readFileSync(path, 'utf-8');
  return parse(content, { columns: true, skip_empty_lines: true }) as T[];
}

export function loadFoodCsv(datasetDir: string): UsdaFoodRow[] {
  return readCsv<UsdaFoodRow>(`${datasetDir}/food.csv`);
}

export function loadFoodNutrientCsv(datasetDir: string): UsdaFoodNutrientRow[] {
  return readCsv<UsdaFoodNutrientRow>(`${datasetDir}/food_nutrient.csv`);
}

export function loadNutrientCsv(datasetDir: string): UsdaNutrientRow[] {
  return readCsv<UsdaNutrientRow>(`${datasetDir}/nutrient.csv`);
}

export function loadFoodCategoryCsv(datasetDir: string): UsdaFoodCategoryRow[] {
  return readCsv<UsdaFoodCategoryRow>(`${datasetDir}/food_category.csv`);
}

/** Only SR Legacy ships this file; Foundation Foods doesn't, so derivation codes stay null for it rather than guessed. */
export function loadFoodNutrientDerivationCsv(datasetDir: string): UsdaFoodNutrientDerivationRow[] {
  const path = `${datasetDir}/food_nutrient_derivation.csv`;
  if (!existsSync(path)) return [];
  return readCsv<UsdaFoodNutrientDerivationRow>(path);
}
