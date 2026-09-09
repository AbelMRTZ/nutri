/**
 * Suspicious-but-plausible data detection. Nothing here ever rejects or
 * alters a value — every check just returns a flag reason (or null), which
 * the caller attaches via is_flagged/flag_reason while still inserting the
 * original amount untouched. Even a negative amount is only flagged, not
 * rejected: USDA's own Foundation Foods data occasionally reports a tiny
 * negative "Carbohydrate, by difference" (e.g. -0.475) — an artifact of how
 * that nutrient is computed, not corrupt data — and the DB has no
 * constraint rejecting it (see migration 0012) precisely so this stays
 * true to the source instead of silently dropping/clamping it.
 */

/** Every unit actually seen in nutrient.csv across Foundation Foods + SR Legacy (verified by inspecting both files). */
export const KNOWN_UNITS = new Set([
  'G',
  'MG',
  'UG',
  'KCAL',
  'kJ',
  'IU',
  'MCG_RE',
  'MG_ATE',
  'MG_GAE',
  'UMOL_TE',
  'PH',
  'SP_GR',
]);

/**
 * Plausible per-100g ranges for the handful of nutrients we understand well
 * enough to judge, keyed by USDA's stable nutrient_nbr. Deliberately small
 * — a nutrient with no entry here is never range-flagged, because guessing
 * a bound for something we don't understand would itself be an invented
 * value judgment.
 */
export const PLAUSIBLE_RANGES: Record<string, { max: number; label: string }> = {
  '208': { max: 902, label: 'Energy (kcal) — theoretical ceiling is pure fat at 9 kcal/g' },
  '203': { max: 100, label: 'Protein (g) — cannot exceed 100 g per 100 g' },
  '204': { max: 100, label: 'Total fat (g) — cannot exceed 100 g per 100 g' },
  '205': { max: 100, label: 'Carbohydrate (g) — cannot exceed 100 g per 100 g' },
  '255': { max: 100, label: 'Water (g) — cannot exceed 100 g per 100 g' },
  '307': { max: 40000, label: 'Sodium (mg) — pure salt is ~38,758 mg/100g' },
  '601': { max: 5000, label: 'Cholesterol (mg) — far above any known whole food' },
};

export function validateNegative(amount: number): string | null {
  if (amount < 0) return `Cantidad negativa (${amount}) — se conserva tal cual la reporta la fuente`;
  return null;
}

export function validateUnit(unitName: string): string | null {
  if (KNOWN_UNITS.has(unitName)) return null;
  return `Unidad no reconocida: "${unitName}"`;
}

export function validateAmountRange(nutrientNbr: string, amount: number): string | null {
  const range = PLAUSIBLE_RANGES[nutrientNbr];
  if (!range) return null;
  if (amount > range.max) {
    return `Valor fuera de rango plausible (${amount} > ${range.max}): ${range.label}`;
  }
  return null;
}
