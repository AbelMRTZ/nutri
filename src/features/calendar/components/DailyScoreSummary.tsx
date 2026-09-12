import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { calculateDailyScore } from '@/features/calendar/calculations/score';
import { PlanProgressSummary, type PlanTargets } from '@/features/plans';
import type { PlanTotals } from '@/features/plans/calculations/totals';
import { useTheme } from '@/hooks/use-theme';

export type DailyScoreSummaryProps = {
  totals: PlanTotals;
  targets: PlanTargets;
  /** When > 0, shown as a note explaining why the calorie target is higher than the base plan/profile target. */
  caloriesBurnedToday?: number;
};

/** Consumed-so-far vs. target progress bars, plus the 0-100 daily score. */
export function DailyScoreSummary({ totals, targets, caloriesBurnedToday }: DailyScoreSummaryProps) {
  const theme = useTheme();
  const score = calculateDailyScore(totals, targets);

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <ThemedText type="smallBold">Puntuación del día</ThemedText>
        <ThemedText type="subtitle" style={{ color: theme.accentSecondary, fontSize: 22, lineHeight: 26 }}>
          {score === null ? '—' : `${score}/100`}
        </ThemedText>
      </View>
      {caloriesBurnedToday ? (
        <ThemedText type="small" themeColor="textSecondary">
          Incluye {caloriesBurnedToday} kcal quemadas en entrenamiento.
        </ThemedText>
      ) : null}
      <PlanProgressSummary totals={totals} targets={targets} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
