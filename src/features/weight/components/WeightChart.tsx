import { useMemo, useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line as SvgLine, Polyline } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { computeNiceScale } from '@/features/weight/calculations/ticks';
import { useTheme } from '@/hooks/use-theme';
import { formatDisplayDate, formatShortDate, fromDateKey } from '@/lib/dates';

export type WeightChartLog = {
  id: string;
  date: string;
  weight_kg: number;
};

export type WeightChartProps = {
  /** Sorted ascending by date. */
  logs: WeightChartLog[];
  height?: number;
};

const CHART_PADDING_Y = 12;
const END_DOT_RADIUS = 5;
const POINT_RADIUS = 3;
const HIT_RADIUS = 14;
const AXIS_WIDTH = 40;
const AXIS_TICK_COUNT = 4;

function formatKg(value: number): string {
  return `${value.toLocaleString('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} kg`;
}

function formatTick(value: number): string {
  return value.toLocaleString('es-ES', { maximumFractionDigits: 1 });
}

/**
 * Weight-over-time line chart. A single series (one metric, one color) needs
 * no legend — the section title above it already says what's plotted — so
 * this only ever draws the line, a left-hand weight axis (so a point's
 * approximate value is readable without tapping it), a couple of direct
 * labels (first/last date), and a tap-to-inspect point, in place of a
 * hover/crosshair layer that doesn't map cleanly onto touch.
 */
export function WeightChart({ logs, height = 180 }: WeightChartProps) {
  const theme = useTheme();
  const [chartWidth, setChartWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function handleChartLayout(event: LayoutChangeEvent) {
    setChartWidth(event.nativeEvent.layout.width);
  }

  const values = logs.map((log) => log.weight_kg);
  const dataMin = values.length ? Math.min(...values) : 0;
  const dataMax = values.length ? Math.max(...values) : 0;

  const scale = useMemo(() => computeNiceScale(dataMin, dataMax, AXIS_TICK_COUNT), [dataMin, dataMax]);
  const domainRange = scale.max - scale.min || 1;

  function yForValue(value: number): number {
    return CHART_PADDING_Y + (1 - (value - scale.min) / domainRange) * (height - CHART_PADDING_Y * 2);
  }

  const firstTime = logs.length ? fromDateKey(logs[0].date).getTime() : 0;
  const lastTime = logs.length ? fromDateKey(logs[logs.length - 1].date).getTime() : 0;
  const timeRange = lastTime - firstTime || 1;

  const points = useMemo(() => {
    if (chartWidth === 0) return [];
    return logs.map((log, index) => {
      const time = fromDateKey(log.date).getTime();
      const x = logs.length === 1 ? chartWidth / 2 : ((time - firstTime) / timeRange) * chartWidth;
      return { x, y: yForValue(log.weight_kg), log, index };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs, chartWidth, height, scale]);

  const selected = selectedIndex !== null ? points[selectedIndex] : undefined;
  const lastIndex = points.length - 1;

  if (logs.length === 0) {
    return (
      <View style={[styles.empty, { height, borderColor: theme.divider }]}>
        <ThemedText type="default" themeColor="textSecondary">
          Todavía no has registrado ningún peso.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tooltipRow}>
        {selected ? (
          <>
            <ThemedText type="smallBold">{formatKg(selected.log.weight_kg)}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatDisplayDate(fromDateKey(selected.log.date))}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Máx {formatKg(dataMax)} · Mín {formatKg(dataMin)}
          </ThemedText>
        )}
      </View>

      <View style={styles.row}>
        <View style={{ width: AXIS_WIDTH, height }}>
          {scale.ticks.map((tick) => (
            <ThemedText
              key={tick}
              type="small"
              themeColor="textSecondary"
              style={[styles.axisLabel, { top: yForValue(tick) - 8 }]}>
              {formatTick(tick)}
            </ThemedText>
          ))}
        </View>

        <View onLayout={handleChartLayout} style={{ flex: 1, height }}>
          {chartWidth > 0 ? (
            <Svg width={chartWidth} height={height}>
              {scale.ticks.map((tick) => (
                <SvgLine
                  key={tick}
                  x1={0}
                  y1={yForValue(tick)}
                  x2={chartWidth}
                  y2={yForValue(tick)}
                  stroke={theme.divider}
                  strokeWidth={1}
                />
              ))}
              {points.length > 1 ? (
                <Polyline
                  points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={theme.accentSecondary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
              {points.map((p) => (
                <Circle
                  key={p.log.id}
                  cx={p.x}
                  cy={p.y}
                  r={p.index === lastIndex || p.index === selectedIndex ? END_DOT_RADIUS : POINT_RADIUS}
                  fill={theme.accentSecondary}
                  stroke={theme.background}
                  strokeWidth={2}
                />
              ))}
            </Svg>
          ) : null}
          {points.map((p) => (
            <Pressable
              key={`hit-${p.log.id}`}
              accessibilityRole="button"
              accessibilityLabel={`${formatKg(p.log.weight_kg)}, ${formatDisplayDate(fromDateKey(p.log.date))}`}
              onPress={() => setSelectedIndex((current) => (current === p.index ? null : p.index))}
              style={{
                position: 'absolute',
                left: p.x - HIT_RADIUS,
                top: p.y - HIT_RADIUS,
                width: HIT_RADIUS * 2,
                height: HIT_RADIUS * 2,
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ width: AXIS_WIDTH }} />
        <View style={styles.dateRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {formatShortDate(fromDateKey(logs[0].date))}
          </ThemedText>
          {logs.length > 1 ? (
            <ThemedText type="small" themeColor="textSecondary">
              {formatShortDate(fromDateKey(logs[logs.length - 1].date))}
            </ThemedText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  tooltipRow: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 20,
  },
  row: {
    flexDirection: 'row',
  },
  axisLabel: {
    position: 'absolute',
    right: 6,
    textAlign: 'right',
  },
  dateRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
});
