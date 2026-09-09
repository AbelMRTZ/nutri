/**
 * Whitespace-only cleanup — never touches wording, casing, or comma
 * structure. USDA descriptions ("Broccoli, raw") carry meaning in that
 * structure; reformatting them would be a (small) invented change to data
 * that's supposed to be verbatim.
 */
export function normalizeName(descriptionOriginal: string): string {
  return descriptionOriginal.trim().replace(/\s+/g, ' ');
}
