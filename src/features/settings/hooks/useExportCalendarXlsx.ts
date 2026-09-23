import { useMutation } from '@tanstack/react-query';

import { fetchCalendarExportRows } from '@/features/settings/api/calendarExport';
import { downloadCalendarExportXlsx } from '@/features/settings/utils/exportCalendarXlsx';

export type ExportCalendarRange = {
  startDate: string;
  endDate: string;
};

export function useExportCalendarXlsx(userId: string | undefined) {
  return useMutation({
    mutationFn: async ({ startDate, endDate }: ExportCalendarRange) => {
      const rows = await fetchCalendarExportRows(userId as string, startDate, endDate);
      await downloadCalendarExportXlsx(rows, startDate, endDate);
    },
  });
}
