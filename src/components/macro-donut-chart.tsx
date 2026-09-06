import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { CALORIES_PER_GRAM } from '@/constants/nutrition';
import { useTheme } from '@/hooks/use-theme';

export type MacroDonutChartProps = {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  size?: number;
  strokeWidth?: number;
};

/**
 * Donut showing the calorie share of each macro (not the gram share) — the
 * point is "where do the calories come from", which is what protein/carbs/
 * fat visually stand for in this app. Takes raw grams so any caller (a food
 * quantity here, a meal or a day total later) can feed it directly.
 *
 * The center label is the macro-derived total (protein*4 + carbs*4 + fat*9),
 * not necessarily a food's own declared energy_kcal — those two routinely
 * differ by a little due to normal rounding on nutrition labels, and both
 * numbers are legitimate; this chart is specifically the macro breakdown, so
 * it stays internally consistent with its own segments rather than being
 * force-fit to match a declared value it isn't describing.
 */
export function MacroDonutChart({ protein_g, carbs_g, fat_g, size = 140, strokeWidth = 16 }: MacroDonutChartProps) {
  const theme = useTheme();

  const proteinKcal = protein_g * CALORIES_PER_GRAM.protein;
  const carbsKcal = carbs_g * CALORIES_PER_GRAM.carbs;
  const fatKcal = fat_g * CALORIES_PER_GRAM.fat;
  const totalKcal = proteinKcal + carbsKcal + fatKcal;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segments = [
    { kcal: proteinKcal, color: theme.accent },
    { kcal: carbsKcal, color: theme.accentSecondary },
    { kcal: fatKcal, color: theme.textSecondary },
  ];

  let cumulative = 0;

  return (
    <View style={{ width: size, height: size }}>
      {/* Rotated at the RN View level (not react-native-svg's own rotation
          prop) so the first segment starts at 12 o'clock instead of 3 o'clock —
          avoids a react-native-svg-web quirk with G's origin/rotation props. */}
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={center} cy={center} r={radius} stroke={theme.divider} strokeWidth={strokeWidth} fill="none" />
        {totalKcal > 0
          ? segments.map((segment, index) => {
              const length = (segment.kcal / totalKcal) * circumference;
              const offset = -cumulative;
              cumulative += length;
              return (
                <Circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  fill="none"
                />
              );
            })
          : null}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <ThemedText type="smallBold">{Math.round(totalKcal)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          kcal
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
