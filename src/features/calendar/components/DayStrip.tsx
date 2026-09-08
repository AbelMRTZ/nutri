import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useCalendarDaysRange } from '@/features/calendar/hooks/useCalendarDaysRange';
import { useTheme } from '@/hooks/use-theme';
import { addDays, formatChipWeekday, isSameDay, toDateKey } from '@/lib/dates';

const DAYS_BEFORE = 7;
const DAYS_AFTER = 21;

export type DayStripProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  userId: string | undefined;
};

export function DayStrip({ selectedDate, onSelectDate, userId }: DayStripProps) {
  const theme = useTheme();

  const days = useMemo(() => {
    const start = addDays(new Date(), -DAYS_BEFORE);
    return Array.from({ length: DAYS_BEFORE + DAYS_AFTER + 1 }, (_, i) => addDays(start, i));
  }, []);

  const startKey = toDateKey(days[0]);
  const endKey = toDateKey(days[days.length - 1]);
  const { data: rangeDays } = useCalendarDaysRange(userId, startKey, endKey);

  const statusByDate = useMemo(() => {
    const map = new Map<string, { is_free: boolean; plan_id: string | null; routine_id: string | null }>();
    rangeDays?.forEach((day) => map.set(day.date, day));
    return map;
  }, [rangeDays]);

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
        const status = statusByDate.get(key);
        const nutritionColor = status?.is_free ? theme.accentSecondary : status?.plan_id ? theme.accent : undefined;
        const trainingColor = status?.routine_id ? theme.text : undefined;

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
            <View style={styles.indicatorRow}>
              <View style={[styles.indicator, { backgroundColor: nutritionColor ?? 'transparent' }]} />
              <View style={[styles.indicator, { backgroundColor: trainingColor ?? 'transparent' }]} />
            </View>
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
  indicatorRow: {
    flexDirection: 'row',
    gap: 3,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
