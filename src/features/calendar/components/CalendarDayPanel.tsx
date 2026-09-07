import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { AssignedPlanSummary } from '@/features/calendar/components/AssignedPlanSummary';
import { DailyTrackingSection } from '@/features/calendar/components/DailyTrackingSection';
import { useCalendarDay } from '@/features/calendar/hooks/useCalendarDay';
import { useMarkDayFree } from '@/features/calendar/hooks/useMarkDayFree';
import { useRemoveDayAssignment } from '@/features/calendar/hooks/useRemoveDayAssignment';
import { usePlan } from '@/features/plans';
import { useTheme } from '@/hooks/use-theme';
import { formatDisplayDate, toDateKey } from '@/lib/dates';

export type CalendarDayPanelProps = {
  date: Date;
  userId: string | undefined;
};

export function CalendarDayPanel({ date, userId }: CalendarDayPanelProps) {
  const theme = useTheme();
  const router = useRouter();
  const dateKey = toDateKey(date);
  const { data: calendarDay, isLoading } = useCalendarDay(userId, dateKey);
  const { data: plan, isLoading: isPlanLoading } = usePlan(calendarDay?.plan_id ?? undefined);
  const markDayFree = useMarkDayFree(userId);
  const removeAssignment = useRemoveDayAssignment(userId);
  const [confirmVisible, setConfirmVisible] = useState(false);

  function handleAssignPlan() {
    router.push({ pathname: '/(app)/(tabs)/calendario/asignar-plan', params: { date: dateKey } });
  }

  function handleRemove() {
    if (!calendarDay) return;
    removeAssignment.mutate({ id: calendarDay.id, date: dateKey }, { onSuccess: () => setConfirmVisible(false) });
  }

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <ThemedText type="subtitle">{formatDisplayDate(date)}</ThemedText>

        {isLoading ? (
          <ActivityIndicator color={theme.primary} />
        ) : !calendarDay ? (
          <View style={styles.actions}>
            <ThemedText type="default" themeColor="textSecondary">
              Todavía no has planificado este día.
            </ThemedText>
            <Button title="Asignar plan" onPress={handleAssignPlan} />
            <Button
              title="Marcar como libre"
              variant="secondary"
              loading={markDayFree.isPending}
              onPress={() => markDayFree.mutate(dateKey)}
            />
          </View>
        ) : calendarDay.is_free ? (
          <View style={styles.actions}>
            <View style={[styles.freeBadge, { backgroundColor: theme.accentSecondary }]}>
              <ThemedText type="smallBold">Día libre</ThemedText>
            </View>
            <Button title="Quitar" variant="ghost" onPress={() => setConfirmVisible(true)} />
          </View>
        ) : isPlanLoading || !plan ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <>
            <AssignedPlanSummary
              plan={plan}
              onEdit={() => router.push(`/(app)/(tabs)/despensa/planes/${plan.id}`)}
              onRemove={() => setConfirmVisible(true)}
            />
            <DailyTrackingSection plan={plan} calendarDayId={calendarDay.id} userId={userId} />
          </>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title="Quitar asignación"
        description="¿Seguro que quieres quitar la asignación de este día?"
        confirmLabel="Quitar"
        loading={removeAssignment.isPending}
        onConfirm={handleRemove}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  actions: {
    gap: 12,
  },
  freeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
