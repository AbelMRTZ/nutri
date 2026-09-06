import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type TargetProgressBarProps = {
  label: string;
  current: number;
  /** `null` means no target is available yet (e.g. profile not filled in). */
  target: number | null;
  unit: string;
  color: string;
  /** Overrides the default "current/target unit" caption (e.g. for "restante: X kcal" wording). */
  caption?: string;
};

/** Generic "current vs. target" bar — reused for Planes' 4 macro bars and, later, Calendario's daily summary. */
export function TargetProgressBar({ label, current, target, unit, color, caption }: TargetProgressBarProps) {
  const theme = useTheme();

  const isOverTarget = target !== null && current > target;
  const fillPct = target && target > 0 ? Math.min(current / target, 1) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
        <ThemedText type="smallBold">
          {caption ?? `${current} / ${target ?? '—'} ${unit}`}
        </ThemedText>
      </View>
      {target !== null ? (
        <View style={[styles.track, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View
            style={[
              styles.fill,
              { width: `${fillPct}%`, backgroundColor: isOverTarget ? theme.danger : color },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    height: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 10,
  },
});
