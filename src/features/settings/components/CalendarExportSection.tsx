import { createElement, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FieldLabel } from '@/components/field-label';
import { ThemedText } from '@/components/themed-text';
import { countDaysInclusive } from '@/features/settings/calculations/buildExportRows';
import { useExportCalendarXlsx } from '@/features/settings/hooks/useExportCalendarXlsx';
import { useTheme } from '@/hooks/use-theme';
import { addDays, toDateKey } from '@/lib/dates';

const MAX_RANGE_DAYS = 366;

export type CalendarExportSectionProps = {
  userId: string | undefined;
  onError: (message: string) => void;
};

/**
 * Web-only: file download in this app is only verified end-to-end against
 * `expo start --web` (the native path would need expo-file-system +
 * expo-sharing plus a Blob→base64 bridge that can't be tested in this
 * environment), so native shows an explanatory note instead of controls
 * that would silently do nothing.
 */
export function CalendarExportSection({ userId, onError }: CalendarExportSectionProps) {
  const theme = useTheme();
  const today = toDateKey(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(toDateKey(addDays(new Date(), 6)));
  const exportMutation = useExportCalendarXlsx(userId);

  const dayCount = countDaysInclusive(startDate, endDate);
  const rangeError =
    dayCount <= 0
      ? 'La fecha "hasta" debe ser igual o posterior a "desde".'
      : dayCount > MAX_RANGE_DAYS
        ? `Elige un rango de como máximo ${MAX_RANGE_DAYS} días.`
        : undefined;

  function handleExport() {
    if (rangeError) return;
    exportMutation.mutate(
      { startDate, endDate },
      { onError: () => onError('No se ha podido generar el Excel. Inténtalo de nuevo.') },
    );
  }

  return (
    <View style={styles.section}>
      <ThemedText type="smallBold">Exportar calendario</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Descarga un Excel con las comidas, alimentos y cantidades de cada día de un rango de fechas de tu calendario.
      </ThemedText>

      {Platform.OS !== 'web' ? (
        <ThemedText type="small" themeColor="textSecondary">
          Esta función está disponible por ahora solo en la versión web de la app.
        </ThemedText>
      ) : (
        <>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <FieldLabel>Desde</FieldLabel>
              <WebDateInput value={startDate} max={endDate} onChange={setStartDate} borderColor={theme.border} textColor={theme.text} />
            </View>
            <View style={styles.dateField}>
              <FieldLabel>Hasta</FieldLabel>
              <WebDateInput value={endDate} min={startDate} onChange={setEndDate} borderColor={theme.border} textColor={theme.text} />
            </View>
          </View>

          {rangeError ? (
            <ThemedText type="small" themeColor="danger">
              {rangeError}
            </ThemedText>
          ) : null}

          <Button title="Descargar Excel" onPress={handleExport} loading={exportMutation.isPending} disabled={!!rangeError} />
        </>
      )}
    </View>
  );
}

type WebDateInputProps = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  borderColor: string;
  textColor: string;
};

/**
 * A real `<input type="date">` — this app has no custom calendar-grid date
 * picker, and building/verifying one wasn't worth it for a web-only
 * feature when the browser already provides a fully accessible one for
 * free. `createElement` (not JSX) sidesteps React Native's JSX typings,
 * which don't recognize DOM intrinsics — safe here because this component
 * only renders on web (see the `Platform.OS` check above).
 */
function WebDateInput({ value, onChange, min, max, borderColor, textColor }: WebDateInputProps) {
  return createElement('input', {
    type: 'date',
    value,
    min,
    max,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
    style: {
      fontFamily: 'inherit',
      fontSize: 15,
      color: textColor,
      backgroundColor: 'transparent',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 12,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 14,
      paddingRight: 14,
      minHeight: 48,
      boxSizing: 'border-box',
      width: '100%',
    },
  });
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
    gap: 8,
  },
});
