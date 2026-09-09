/** Raw shapes as they appear in the USDA CSV files we read — field names match the CSV headers verbatim. */

export type UsdaFoodRow = {
  fdc_id: string;
  data_type: string;
  description: string;
  food_category_id: string;
  publication_date: string;
};

export type UsdaFoodNutrientRow = {
  id: string;
  fdc_id: string;
  nutrient_id: string;
  amount: string;
  data_points: string;
  derivation_id: string;
  min: string;
  max: string;
  median: string;
  footnote: string;
  min_year_acquired: string;
};

export type UsdaNutrientRow = {
  id: string;
  name: string;
  unit_name: string;
  nutrient_nbr: string;
  rank: string;
};

export type UsdaFoodCategoryRow = {
  id: string;
  code: string;
  description: string;
};

export type UsdaFoodNutrientDerivationRow = {
  id: string;
  code: string;
  description: string;
  source_id: string;
};

export type DatasetLabel = 'usda_foundation_foods' | 'usda_sr_legacy';

/** A parsed USDA food that survived category + brand filtering, ready to upsert. */
export type CandidateFood = {
  fdcId: string;
  descriptionOriginal: string;
  usdaCategoryRaw: string;
  mappedCategory: string;
  isFlagged: boolean;
  flagReason: string | null;
};

export type ImportReportEntry = {
  dataset: DatasetLabel;
  datasetVersion: string;
  totalOfType: number;
  excludedByCategory: number;
  excludedByBrand: number;
  keptFoods: number;
  nutrientRowsInserted: number;
  duplicateSourceNutrientRows: number;
  flaggedFoods: number;
  flaggedNutrientRows: number;
  categoryFallbackToOther: string[]; // raw USDA categories that had no explicit mapping
  excludedByCategoryBreakdown: Record<string, number>;
  sampleExcludedByBrand: string[]; // first N descriptions excluded for review
};

export type ImportReport = {
  startedAt: string;
  finishedAt: string;
  entries: ImportReportEntry[];
  nutrientsUpserted: number;
};
