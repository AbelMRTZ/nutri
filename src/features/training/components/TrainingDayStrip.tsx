import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useActivityDatesInRange } from '@/features/training/hooks/useActivityDatesInRange';
import { useTheme } from '@/hooks/use-theme';
import { addDays, formatChipWeekday, isSameDay, toDateKey } from '@/lib/dates';

const DAYS_BEFORE = 7;
const DAYS_AFTER = 21;

export type TrainingDayStripProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  userId: string | undefined;
};

/**
 * Self-contained day strip for the training feature — deliberately not a
 * shared component with `calendar`'s `DayStrip`: `calendar` already imports
 * from `training` (for the day summary/indicator shown on its own panel),
 * so `training` must never import anything back from `calendar` to keep
 * that dependency one-directional. A small duplicated strip is cheaper than
 * a cross-feature cycle.
 */
export function TrainingDayStrip({ selectedDate, onSelectDate, userId }: TrainingDayStripProps) {
  const theme = useTheme();

  const days = useMemo(() => {
    const start = addDays(new Date(), -DAYS_BEFORE);
    return Array.from({ length: DAYS_BEFORE + DAYS_AFTER + 1 }, (_, i) => addDays(start, i));
  }, []);

  const startKey = toDateKey(days[0]);
  const endKey = toDateKey(days[days.length - 1]);
  const { data: activityDates } = useActivityDatesInRange(userId, startKey, endKey);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.flatList}
      data={days}
      keyExtractor={(date) => toDateKey(date)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const key = toDateKey(item);
        const selected = isSameDay(item, selectedDate);
        const hasActivity = activityDates?.has(key) ?? false;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelectDate(item)}
            style={[
              styles.chip,
              { borderColor: theme.border, backgroundColor: selected ? theme.accent : theme.background },
            ]}>
            <ThemedText type="small" style={{ color: selected ? '#FFFFFF' : theme.textSecondary }}>
              {formatChipWeekday(item)}
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: selected ? '#FFFFFF' : theme.text }}>
              {item.getDate()}
            </ThemedText>
            <View style={[styles.indicator, { backgroundColor: hasActivity ? theme.accent : 'transparent' }]} />
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 0,
    flexShrink: 0,
    height: 100,
  },
  list: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chip: {
    width: 52,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
