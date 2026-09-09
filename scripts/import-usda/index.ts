import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { isLikelyBrand } from './brandFilter';
import { mapUsdaCategory } from './mapCategory';
import { normalizeName } from './normalizeName';
import { loadFoodCategoryCsv, loadFoodCsv, loadFoodNutrientCsv, loadFoodNutrientDerivationCsv, loadNutrientCsv } from './parseCsv';
import type { DatasetLabel, ImportReport, ImportReportEntry, UsdaFoodRow } from './types';
import type { FoodCategory } from '../../src/features/foods/schema';
import { upsertNutrients, upsertReferenceFoodNutrients, upsertReferenceFoods } from './upsert';
import { validateAmountRange, validateNegative, validateUnit } from './validate';
import type { TablesInsert } from '../../src/lib/supabase/database.types';

type DatasetConfig = {
  label: DatasetLabel;
  dir: string;
  wantedDataType: string;
};

function parseArgs(): { foundation?: string; srLegacy?: string } {
  const args = process.argv.slice(2);
  const result: { foundation?: string; srLegacy?: string } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--foundation') result.foundation = args[++i];
    if (args[i] === '--sr-legacy') result.srLegacy = args[++i];
  }
  return result;
}

/** Uses the extracted folder's own name as the dataset version — informative and never guessed/reformatted. */
function datasetVersionFromDir(dir: string): string {
  return path.basename(path.resolve(dir));
}

function loadTranslations(): Record<string, string> {
  const filePath = path.join(__dirname, 'translations.es.json');
  if (!existsSync(filePath)) return {};
  return JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, string>;
}

type NameOccurrence = { dataset: DatasetLabel; fdcId: string };

async function importDataset(
  config: DatasetConfig,
  translations: Record<string, string>,
  nutrientIdByNbr: Map<string, string>,
  allDescriptionsSeen: Map<string, NameOccurrence[]>,
): Promise<ImportReportEntry> {
  const { label, dir, wantedDataType } = config;
  const datasetVersion = datasetVersionFromDir(dir);

  const foodRows = loadFoodCsv(dir);
  const categoryById = new Map(loadFoodCategoryCsv(dir).map((c) => [c.id, c.description]));
  const nutrientRowsForDataset = loadNutrientCsv(dir);
  const nutrientNbrById = new Map(nutrientRowsForDataset.map((n) => [n.id, n.nutrient_nbr]));
  const unitByNutrientId = new Map(nutrientRowsForDataset.map((n) => [n.id, n.unit_name]));
  const derivationCodeById = new Map(loadFoodNutrientDerivationCsv(dir).map((d) => [d.id, d.code]));

  const ofType = foodRows.filter((f) => f.data_type === wantedDataType);

  let excludedByCategory = 0;
  let excludedByBrand = 0;
  const excludedByCategoryBreakdown: Record<string, number> = {};
  const categoryFallbackToOther = new Set<string>();
  const sampleExcludedByBrand: string[] = [];
  const keptFoods: { row: UsdaFoodRow; category: FoodCategory; usdaCategoryRaw: string }[] = [];

  for (const row of ofType) {
    const usdaCategoryRaw = categoryById.get(row.food_category_id) ?? 'UNKNOWN';
    const mapping = mapUsdaCategory(usdaCategoryRaw);

    if (mapping.kind === 'excluded') {
      excludedByCategory++;
      excludedByCategoryBreakdown[usdaCategoryRaw] = (excludedByCategoryBreakdown[usdaCategoryRaw] ?? 0) + 1;
      continue;
    }

    if (isLikelyBrand(row.description)) {
      excludedByBrand++;
      if (sampleExcludedByBrand.length < 50) sampleExcludedByBrand.push(row.description);
      continue;
    }

    const category = mapping.kind === 'mapped' ? mapping.category : 'other';
    if (mapping.kind === 'unmapped') categoryFallbackToOther.add(usdaCategoryRaw);

    keptFoods.push({ row, category, usdaCategoryRaw });

    const normalized = normalizeName(row.description).toLowerCase();
    const occurrences = allDescriptionsSeen.get(normalized) ?? [];
    occurrences.push({ dataset: label, fdcId: row.fdc_id });
    allDescriptionsSeen.set(normalized, occurrences);
  }

  console.log(
    `\n[${label}] ${ofType.length} foods de tipo "${wantedDataType}" — excluidos por categoría: ${excludedByCategory}, excluidos por marca: ${excludedByBrand}, mantenidos: ${keptFoods.length}`,
  );

  const referenceFoodInserts: TablesInsert<'reference_foods'>[] = keptFoods.map(({ row, category, usdaCategoryRaw }) => ({
    source: label,
    source_id: row.fdc_id,
    source_dataset: row.data_type,
    source_dataset_version: datasetVersion,
    name_original: row.description,
    name_es: translations[row.fdc_id] ?? null,
    category,
    usda_food_category_raw: usdaCategoryRaw,
    serving_type: 'per_100g',
  }));

  const upsertedFoods = await upsertReferenceFoods(referenceFoodInserts);
  const referenceFoodIdByFdcId = new Map(upsertedFoods.map((f) => [f.source_id, f.id]));
  console.log(`[${label}] Upsertadas ${upsertedFoods.length} filas en reference_foods.`);

  const keptFdcIds = new Set(keptFoods.map((f) => f.row.fdc_id));
  const foodNutrientRows = loadFoodNutrientCsv(dir).filter((fn) => keptFdcIds.has(fn.fdc_id));

  const nutrientInserts: TablesInsert<'reference_food_nutrients'>[] = [];
  let flaggedNutrientRows = 0;
  // A handful of USDA source rows repeat the exact same (fdc_id, nutrient_id)
  // pair (verified: 4 pairs in Foundation Foods, all either blank amounts —
  // already skipped below — or an identical value repeated). Postgres's
  // ON CONFLICT can't resolve two rows targeting the same key within one
  // upsert, so duplicates must be collapsed before insert, not after.
  const seenKeyToAmount = new Map<string, number>();
  let duplicateSourceRows = 0;

  for (const fn of foodNutrientRows) {
    const amountStr = fn.amount?.trim();
    if (!amountStr) continue; // not reported by the source — never insert a placeholder amount
    const amount = Number(amountStr);
    if (!Number.isFinite(amount)) continue;

    const referenceFoodId = referenceFoodIdByFdcId.get(fn.fdc_id);
    const nutrientNbr = nutrientNbrById.get(fn.nutrient_id);
    if (!referenceFoodId || !nutrientNbr) continue; // defensive — shouldn't happen given the filters above
    const nutrientId = nutrientIdByNbr.get(nutrientNbr);
    if (!nutrientId) continue;

    const dedupeKey = `${referenceFoodId}:${nutrientId}`;
    const previousAmount = seenKeyToAmount.get(dedupeKey);
    if (previousAmount !== undefined) {
      duplicateSourceRows++;
      if (previousAmount !== amount) {
        console.warn(
          `[${label}] fdc_id ${fn.fdc_id}, nutriente ${nutrientNbr}: valores distintos para el mismo par (se conserva el primero: ${previousAmount}, se descarta: ${amount}).`,
        );
      }
      continue;
    }
    seenKeyToAmount.set(dedupeKey, amount);

    const unit = unitByNutrientId.get(fn.nutrient_id) ?? '';
    const negativeFlag = validateNegative(amount);
    const unitFlag = validateUnit(unit);
    const rangeFlag = validateAmountRange(nutrientNbr, amount);
    const flagReason = [negativeFlag, unitFlag, rangeFlag].filter(Boolean).join('; ') || null;
    if (flagReason) flaggedNutrientRows++;

    nutrientInserts.push({
      reference_food_id: referenceFoodId,
      nutrient_id: nutrientId,
      amount,
      unit,
      source: label,
      source_food_id: fn.fdc_id,
      derivation_code: derivationCodeById.get(fn.derivation_id) ?? null,
      is_flagged: !!flagReason,
      flag_reason: flagReason,
    });
  }

  const insertedNutrientCount = await upsertReferenceFoodNutrients(nutrientInserts);
  console.log(
    `[${label}] Upsertadas ${insertedNutrientCount} filas en reference_food_nutrients (${flaggedNutrientRows} marcadas, ${duplicateSourceRows} filas duplicadas en el CSV de origen descartadas tras conservar la primera).`,
  );

  return {
    dataset: label,
    datasetVersion,
    totalOfType: ofType.length,
    excludedByCategory,
    excludedByBrand,
    keptFoods: keptFoods.length,
    nutrientRowsInserted: insertedNutrientCount,
    duplicateSourceNutrientRows: duplicateSourceRows,
    flaggedFoods: 0,
    flaggedNutrientRows,
    categoryFallbackToOther: [...categoryFallbackToOther],
    excludedByCategoryBreakdown,
    sampleExcludedByBrand,
  };
}

async function main() {
  const { foundation, srLegacy } = parseArgs();
  if (!foundation && !srLegacy) {
    console.error('Uso: npm run import:usda -- --foundation <carpeta> --sr-legacy <carpeta>');
    process.exit(1);
  }

  const translations = loadTranslations();
  const startedAt = new Date().toISOString();

  // 1. Nutrient dictionary first — reference_food_nutrients needs its uuid.
  const datasetDirs = [foundation, srLegacy].filter((d): d is string => !!d);
  const nutrientDictionary = new Map<string, TablesInsert<'nutrients'>>();
  for (const dir of datasetDirs) {
    for (const n of loadNutrientCsv(dir)) {
      nutrientDictionary.set(n.nutrient_nbr, {
        usda_nutrient_nbr: n.nutrient_nbr,
        usda_nutrient_id: Number(n.id),
        name: n.name,
        unit: n.unit_name,
        rank: n.rank ? Math.trunc(Number(n.rank)) : null,
      });
    }
  }
  const upsertedNutrients = await upsertNutrients([...nutrientDictionary.values()]);
  const nutrientIdByNbr = new Map(upsertedNutrients.map((n) => [n.usda_nutrient_nbr, n.id]));
  console.log(`Diccionario de nutrientes: ${upsertedNutrients.length} nutrientes upsertados.`);

  // 2. Each dataset.
  const configs: DatasetConfig[] = [];
  if (foundation) configs.push({ label: 'usda_foundation_foods', dir: foundation, wantedDataType: 'foundation_food' });
  if (srLegacy) configs.push({ label: 'usda_sr_legacy', dir: srLegacy, wantedDataType: 'sr_legacy_food' });

  const allDescriptionsSeen = new Map<string, NameOccurrence[]>();
  const entries: ImportReportEntry[] = [];
  for (const config of configs) {
    entries.push(await importDataset(config, translations, nutrientIdByNbr, allDescriptionsSeen));
  }

  // 3. Cross-dataset name collisions — informational only, both rows are kept as separate, traceable foods.
  const crossDatasetDuplicates = [...allDescriptionsSeen.entries()].filter(([, occurrences]) => {
    return new Set(occurrences.map((o) => o.dataset)).size > 1;
  });
  if (crossDatasetDuplicates.length > 0) {
    console.log(
      `\n${crossDatasetDuplicates.length} nombres normalizados aparecen en más de un dataset (se mantienen como alimentos distintos y trazables):`,
    );
    for (const [name, occurrences] of crossDatasetDuplicates.slice(0, 20)) {
      console.log(`  - "${name}": ${occurrences.map((o) => `${o.dataset}#${o.fdcId}`).join(', ')}`);
    }
  }

  const finishedAt = new Date().toISOString();
  const report: ImportReport = { startedAt, finishedAt, entries, nutrientsUpserted: upsertedNutrients.length };

  const reportsDir = path.join(__dirname, 'reports');
  mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${startedAt.replace(/[:.]/g, '-')}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nInforme guardado en ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
