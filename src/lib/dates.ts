/**
 * Local-timezone YYYY-MM-DD for DB storage/queries — never toISOString(),
 * which shifts by the UTC offset and can land on the wrong day near midnight.
 */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });
const WEEKDAY_LONG_FORMAT = new Intl.DateTimeFormat('es-ES', { weekday: 'long' });
const DISPLAY_FORMAT = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

/** e.g. "lun" — for the day-strip chip. */
export function formatChipWeekday(date: Date): string {
  return WEEKDAY_FORMAT.format(date);
}

/** e.g. "jueves" — for a spreadsheet/table row, where the abbreviation reads worse than the full word. */
export function formatWeekdayLong(date: Date): string {
  return WEEKDAY_LONG_FORMAT.format(date);
}

/** e.g. "lunes, 7 de septiembre" — for the day panel header. */
export function formatDisplayDate(date: Date): string {
  return DISPLAY_FORMAT.format(date);
}

/** e.g. "07/09/2026" — for compact ranges (the weight chart's axis dates) where the long form takes too much space. */
export function formatShortDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}
