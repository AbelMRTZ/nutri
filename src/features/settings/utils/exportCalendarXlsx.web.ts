import writeXlsxFile, { getSheetData, type Column } from 'write-excel-file/browser';

import { buildShoppingListRows, type CalendarExportRow, type ShoppingListRow } from '@/features/settings/calculations/buildExportRows';

function boldHeader(text: string) {
  return { value: text, fontWeight: 'bold' as const };
}

/**
 * write-excel-file converts a `Date` cell to an Excel serial number via
 * `date.getTime() / dayInMs` — pure UTC epoch math, with no awareness of
 * the local calendar day a `Date` object "means". `row.date` is built as a
 * local-midnight `Date` (via `fromDateKey`, same convention as the rest of
 * the app), so in any timezone ahead of UTC its `getTime()` falls on the
 * previous UTC day and the exported cell silently shows one day earlier.
 * Re-anchoring to UTC midnight for the same Y/M/D fixes the serialization
 * without touching the shared local-Date convention used everywhere else
 * (e.g. weekday formatting, which stays correct either way).
 */
function toExcelDate(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

const calendarColumns: Column<CalendarExportRow>[] = [
  { header: boldHeader('Fecha'), cell: (row) => ({ value: toExcelDate(row.date), type: Date, format: 'dd/mm/yyyy' }), width: 14 },
  { header: boldHeader('Día'), cell: (row) => ({ value: row.weekday }), width: 11 },
  { header: boldHeader('Comida'), cell: (row) => ({ value: row.meal ?? undefined }), width: 26 },
  { header: boldHeader('Categoría'), cell: (row) => ({ value: row.category ?? undefined }), width: 14 },
  { header: boldHeader('Alimento'), cell: (row) => ({ value: row.food ?? undefined }), width: 28 },
  { header: boldHeader('Cantidad'), cell: (row) => ({ value: row.quantity ?? undefined, type: Number }), width: 10 },
  { header: boldHeader('Unidad'), cell: (row) => ({ value: row.unit ?? undefined }), width: 10 },
  { header: boldHeader('Calorías (kcal)'), cell: (row) => ({ value: row.kcal ?? undefined, type: Number, format: '0.0' }), width: 14 },
  { header: boldHeader('Proteína (g)'), cell: (row) => ({ value: row.protein_g ?? undefined, type: Number, format: '0.00' }), width: 13 },
  { header: boldHeader('Carbohidratos (g)'), cell: (row) => ({ value: row.carbs_g ?? undefined, type: Number, format: '0.00' }), width: 17 },
  { header: boldHeader('Grasas (g)'), cell: (row) => ({ value: row.fat_g ?? undefined, type: Number, format: '0.00' }), width: 12 },
];

const shoppingListColumns: Column<ShoppingListRow>[] = [
  { header: boldHeader('Alimento'), cell: (row) => ({ value: row.food }), width: 28 },
  { header: boldHeader('Categoría'), cell: (row) => ({ value: row.foodCategory ?? undefined }), width: 16 },
  { header: boldHeader('Cantidad total'), cell: (row) => ({ value: row.quantity, type: Number }), width: 14 },
  { header: boldHeader('Unidad'), cell: (row) => ({ value: row.unit }), width: 10 },
];

/**
 * Triggers a browser "Save as" download of the given rows as a .xlsx file
 * with two sheets: "Calendario" (one row per día/comida/alimento) and
 * "Lista de la compra" (each food's quantity summed across the whole
 * range). Web-only (see AjustesScreen/CalendarExportSection) — this lives
 * in a `.web.ts` file (not a plain `.ts` one) so Metro resolves it only
 * when bundling for web; a sibling `exportCalendarXlsx.ts` is what native
 * bundles resolve instead. A dynamic `import('write-excel-file/browser')`
 * doesn't achieve that on its own — Metro still statically resolves a
 * dynamic import's specifier into every platform's bundle graph even
 * though the call itself only ever runs at runtime, so the native build
 * failed trying to resolve a subpath the package doesn't publish for RN.
 */
export async function downloadCalendarExportXlsx(rows: CalendarExportRow[], startDate: string, endDate: string) {
  const shoppingListRows = buildShoppingListRows(rows);

  await writeXlsxFile(
    [
      {
        sheet: 'Calendario',
        data: getSheetData(rows, calendarColumns),
        columns: calendarColumns.map((column) => ({ width: column.width })),
      },
      {
        sheet: 'Lista de la compra',
        data: getSheetData(shoppingListRows, shoppingListColumns),
        columns: shoppingListColumns.map((column) => ({ width: column.width })),
      },
    ],
  ).toFile(`calendario_${startDate}_a_${endDate}.xlsx`);
}
