/**
 * Curated, reviewed list of brand/product-line names that still show up
 * inside SR Legacy even after excluding the obviously commercial USDA
 * categories (Fast Foods, Restaurant Foods, ...) — built by inspecting the
 * real downloaded CSVs (see the "Sweets"/"Baked Products"/"Beverages"/
 * "Breakfast Cereals" categories, which are otherwise kept). This is a
 * plain substring match against `food.description`, auditable and
 * extendable by hand — never a model deciding at import time.
 *
 * Deliberately excludes common generic words that happen to be ALL CAPS in
 * some descriptions (USDA, USA, BBQ, REAL, CREAM, WHEAT, OATS, HONEY...) —
 * those are legitimate ingredient words, not brands, and blacklisting them
 * would wrongly drop basic foods.
 */
export const BRAND_TOKENS: readonly string[] = [
  'QUAKER',
  'POST,',
  'POST ',
  'MALT-O-MEAL',
  'RALSTON',
  'GENERAL MILLS',
  'KRETSCHMER',
  "NATURE'S PATH",
  "BARBARA'S",
  'HEALTH VALLEY',
  "MOM'S BEST",
  'UNCLE SAM',
  'WEETABIX',
  'ALPEN',
  'FAMILIA',
  'NESTLE',
  'KRAFT',
  'HORMEL',
  'HERSHEY',
  'DANNON',
  'CHOBANI',
  'OIKOS',
  'SILK',
  'BREYERS',
  'ABBOTT',
  'ENSURE',
  'OCEAN SPRAY',
  'BOLTHOUSE',
  'NAKED JUICE',
  'ODWALLA',
  'LIFEWAY',
  'UNILEVER',
  'SLIMFAST',
  'KLONDIKE',
  'COCOAVIA',
  "REESE'S",
  'SNICKERS',
  'TWIZZLERS',
  'TWIX',
  'MUSKETEERS',
  'STARBURST',
  'SKITTLES',
  'TOBLERONE',
  'BUTTERFINGER',
  'SCHIFF',
  'TOOTSIE ROLL',
  'POPSICLE',
  'CREAMSICLE',
  'PILLSBURY',
  'BIMBO',
  'GEORGE WESTON',
  'MARS ',
  'M&M',
  'COCA-COLA',
  'BUDWEISER',
  'GOOBERS',
  'BABY RUTH',
  'BIT-O-HONEY',
  "CAP'N CRUNCH",
  "MOTHER'S",
  'ALMOND JOY',
] as const;

export function isLikelyBrand(description: string): boolean {
  return BRAND_TOKENS.some((token) => description.includes(token));
}
