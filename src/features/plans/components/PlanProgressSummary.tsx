import { StyleSheet, View } from 'react-native';

import { TargetProgressBar } from '@/components/target-progress-bar';
import type { PlanTotals } from '@/features/plans/calculations/totals';
import { useTheme } from '@/hooks/use-theme';

export type PlanTargets = {
  calories_target: number | null;
  protein_g_target: number | null;
  carbs_g_target: number | null;
  fat_g_target: number | null;
};

export type PlanProgressSummaryProps = {
  totals: PlanTotals;
  targets: PlanTargets;
};

/** Four "current vs. target" bars — how the plan is tracking as it's built. */
export function PlanProgressSummary({ totals, targets }: PlanProgressSummaryProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TargetProgressBar
        label="Calorías"
        current={totals.energy_kcal}
        target={targets.calories_target}
        unit="kcal"
        color={theme.accentSecondary}
      />
      <TargetProgressBar
        label="Proteína"
        current={totals.protein_g}
        target={targets.protein_g_target}
        unit="g"
        color={theme.accentSecondary}
      />
      <TargetProgressBar
        label="Carbohidratos"
        current={totals.carbs_g}
        target={targets.carbs_g_target}
        unit="g"
        color={theme.accentSecondary}
      />
      <TargetProgressBar
        label="Grasa"
        current={totals.fat_g}
        target={targets.fat_g_target}
        unit="g"
        color={theme.accentSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
});
