import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { NumericField } from '@/components/numeric-field';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { generateScheduleDates } from '@/features/calendar/calculations/schedule';
import { useApplyPlanSchedule } from '@/features/calendar/hooks/useApplyPlanSchedule';
import { useCalendarDaysRange } from '@/features/calendar/hooks/useCalendarDaysRange';
import { useAuth } from '@/features/auth';
import { usePlan } from '@/features/plans';
import { useTheme } from '@/hooks/use-theme';
import { addDays, toDateKey } from '@/lib/dates';

const WEEKDAY_OPTIONS = [
  { label: 'L', day: 1 },
  { label: 'M', day: 2 },
  { label: 'X', day: 3 },
  { label: 'J', day: 4 },
  { label: 'V', day: 5 },
  { label: 'S', day: 6 },
  { label: 'D', day: 0 },
];
const ALL_WEEKDAYS = new Set(WEEKDAY_OPTIONS.map((option) => option.day));

export type PlanScheduleScreenProps = {
  planId: string;
};

/** Bulk-assigns a plan to every date, in the next N days from today, that falls on a selected weekday. */
export function PlanScheduleScreen({ planId }: PlanScheduleScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: plan } = usePlan(planId);
  const applySchedule = useApplyPlanSchedule(userId);
  const [days, setDays] = useState<number | undefined>(7);
  const [weekdays, setWeekdays] = useState<Set<number>>(ALL_WEEKDAYS);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Stable for the component's lifetime so the preview doesn't shift as time passes while the screen is open.
  const [startDate] = useState(() => new Date());

  const scheduledDates = useMemo(
    () => generateScheduleDates(startDate, days ?? 0, weekdays),
    [startDate, days, weekdays],
  );

  const startKey = toDateKey(startDate);
  const endKey = toDateKey(addDays(startDate, Math.max((days ?? 1) - 1, 0)));
  const { data: existingDays } = useCalendarDaysRange(userId, startKey, endKey);

  const conflictCount = useMemo(() => {
    const scheduledKeys = new Set(scheduledDates.map(toDateKey));
    return (existingDays ?? []).filter((day) => scheduledKeys.has(day.date) && (day.plan_id !== null || day.is_free))
      .length;
  }, [existingDays, scheduledDates]);

  function toggleWeekday(day: number) {
    setWeekdays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  }

  function applyRows() {
    const rows = scheduledDates.map((date) => ({
      user_id: userId as string,
      date: toDateKey(date),
      plan_id: planId,
      is_free: false,
    }));
    applySchedule.mutate(rows, { onSuccess: () => router.back() });
  }

  return (
    <Screen scroll style={styles.content}>
      <ThemedText type="subtitle">Programar {plan ? `"${plan.name}"` : 'plan'}</ThemedText>
      <ThemedText type="default" themeColor="textSecondary">
        Se asignará este plan a partir de hoy, en los días de la semana que elijas.
      </ThemedText>

      <NumericField label="Repetir durante (días)" value={days} onChangeNumber={setDays} suffix="días" />

      <View style={styles.weekdaySection}>
        <ThemedText type="smallBold">Días de la semana</ThemedText>
        <View style={styles.weekdayRow}>
          {WEEKDAY_OPTIONS.map(({ label, day }) => {
            const selected = weekdays.has(day);
            return (
              <Pressable
                key={day}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => toggleWeekday(day)}
                style={[
                  styles.weekdayPill,
                  { borderColor: selected ? theme.accent : theme.border, backgroundColor: selected ? theme.accent : 'transparent' },
                ]}>
                <ThemedText type="smallBold" style={{ color: selected ? '#FFFFFF' : theme.text }}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {scheduledDates.length === 0
          ? 'Selecciona al menos un día de la semana.'
          : `Se asignará a ${scheduledDates.length} día${scheduledDates.length === 1 ? '' : 's'}.`}
      </ThemedText>

      <Button
        title="Programar plan"
        disabled={scheduledDates.length === 0}
        loading={applySchedule.isPending}
        onPress={() => (conflictCount > 0 ? setConfirmVisible(true) : applyRows())}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Sobrescribir días existentes"
        description={`${conflictCount} de los días seleccionados ya tienen un plan asignado o están marcados como libres. ¿Quieres sobrescribirlos?`}
        confirmLabel="Sobrescribir"
        loading={applySchedule.isPending}
        onConfirm={() => {
          setConfirmVisible(false);
          applyRows();
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  weekdaySection: {
    gap: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weekdayPill: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
