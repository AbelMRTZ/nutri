import type { CalendarExportRow } from '@/features/settings/calculations/buildExportRows';

/**
 * Native counterpart of `exportCalendarXlsx.web.ts` — Metro resolves this
 * file (not the `.web.ts` one) when bundling for iOS/Android, so the
 * native bundle never has to resolve `write-excel-file/browser`, which
 * isn't published for RN. This body should never actually run:
 * `CalendarExportSection` only renders the "Descargar Excel" button behind
 * a `Platform.OS === 'web'` check, so nothing on native ever calls this.
 */
export async function downloadCalendarExportXlsx(
  _rows: CalendarExportRow[],
  _startDate: string,
  _endDate: string,
): Promise<void> {
  throw new Error('La exportación a Excel solo está disponible en la versión web de la app.');
}
