import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { useDeactivateRecurringSchedule } from '@/features/calendar/hooks/useDeactivateRecurringSchedule';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

const WEEKDAY_LABELS_IN_ORDER: { label: string; day: number }[] = [
  { label: 'L', day: 1 },
  { label: 'M', day: 2 },
  { label: 'X', day: 3 },
  { label: 'J', day: 4 },
  { label: 'V', day: 5 },
  { label: 'S', day: 6 },
  { label: 'D', day: 0 },
];

function formatWeekdays(weekdays: number[]): string {
  const set = new Set(weekdays);
  return WEEKDAY_LABELS_IN_ORDER.filter((option) => set.has(option.day))
    .map((option) => option.label)
    .join(', ');
}

export type RecurringScheduleSummaryProps = {
  schedule: Tables<'plan_recurring_schedules'>;
  userId: string | undefined;
};

/** Shown instead of the scheduling form once a plan already has an active indefinite repetition. */
export function RecurringScheduleSummary({ schedule, userId }: RecurringScheduleSummaryProps) {
  const theme = useTheme();
  const deactivate = useDeactivateRecurringSchedule(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={styles.info}>
        <ThemedText type="smallBold">Repetición indefinida activa</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Se repite los días: {formatWeekdays(schedule.weekdays)}
        </ThemedText>
      </View>
      <Button variant="ghost" title="Desactivar repetición" onPress={() => setConfirmVisible(true)} />

      <ConfirmDialog
        visible={confirmVisible}
        title="Desactivar repetición"
        description="El plan dejará de repetirse a partir de hoy. Los días futuros que ya se habían asignado por esta repetición se liberarán; los días pasados no se tocan."
        confirmLabel="Desactivar"
        loading={deactivate.isPending}
        onConfirm={() =>
          deactivate.mutate(schedule, {
            onSuccess: () => setConfirmVisible(false),
          })
        }
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    gap: 16,
  },
  info: {
    gap: 2,
  },
});
