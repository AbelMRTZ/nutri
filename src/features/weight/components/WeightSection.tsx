import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { OptionPicker } from '@/components/option-picker';
import { ThemedText } from '@/components/themed-text';
import { filterLogsByRange, weightChartRangeOptions, type WeightChartRange } from '@/features/weight/calculations/range';
import { WeightChart } from '@/features/weight/components/WeightChart';
import { WeightLogDialog } from '@/features/weight/components/WeightLogDialog';
import { useWeightLogs } from '@/features/weight/hooks/useWeightLogs';
import { useTheme } from '@/hooks/use-theme';

export type WeightSectionProps = {
  userId: string | undefined;
  onError: (message: string) => void;
};

/** Home-screen widget: weight progression chart (with a range filter) plus the entry point to log/edit a day's weight. */
export function WeightSection({ userId, onError }: WeightSectionProps) {
  const theme = useTheme();
  const { data: logs } = useWeightLogs(userId);
  const [range, setRange] = useState<WeightChartRange>('month');
  const [dialogVisible, setDialogVisible] = useState(false);

  const visibleLogs = useMemo(() => filterLogsByRange(logs ?? [], range, new Date()), [logs, range]);

  const existingByDate = useMemo(() => {
    const map = new Map<string, { id: string; weight_kg: number }>();
    logs?.forEach((log) => map.set(log.date, { id: log.id, weight_kg: log.weight_kg }));
    return map;
  }, [logs]);

  return (
    <View style={[styles.container, { borderBottomColor: theme.divider }]}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold">Peso corporal</ThemedText>
        <Button title="Registrar peso" variant="secondary" onPress={() => setDialogVisible(true)} style={styles.registerButton} />
      </View>

      <OptionPicker label="Rango" options={weightChartRangeOptions} value={range} onChange={setRange} />

      <WeightChart logs={visibleLogs} />

      <WeightLogDialog
        visible={dialogVisible}
        userId={userId}
        existingByDate={existingByDate}
        onClose={() => setDialogVisible(false)}
        onError={onError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 12,
    borderBottomWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registerButton: {
    paddingHorizontal: 12,
    minHeight: 40,
  },
});
