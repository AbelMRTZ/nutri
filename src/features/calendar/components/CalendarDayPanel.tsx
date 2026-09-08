import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ThemedText } from '@/components/themed-text';
import { AssignedPlanSummary } from '@/features/calendar/components/AssignedPlanSummary';
import { AssignedRoutineSummary } from '@/features/calendar/components/AssignedRoutineSummary';
import { DailyTrackingSection } from '@/features/calendar/components/DailyTrackingSection';
import { useCalendarDay } from '@/features/calendar/hooks/useCalendarDay';
import { useMarkDayFree } from '@/features/calendar/hooks/useMarkDayFree';
import { useUpdateCalendarDay } from '@/features/calendar/hooks/useUpdateCalendarDay';
import { usePlan } from '@/features/plans';
import { useRoutine } from '@/features/routines';
import { useTheme } from '@/hooks/use-theme';
import { formatDisplayDate, toDateKey } from '@/lib/dates';

export type CalendarDayPanelProps = {
  date: Date;
  userId: string | undefined;
};

type PendingRemoval = 'plan' | 'free' | 'routine' | null;

export function CalendarDayPanel({ date, userId }: CalendarDayPanelProps) {
  const theme = useTheme();
  const router = useRouter();
  const dateKey = toDateKey(date);
  const { data: calendarDay, isLoading } = useCalendarDay(userId, dateKey);
  const { data: plan, isLoading: isPlanLoading } = usePlan(calendarDay?.plan_id ?? undefined);
  const { data: routine, isLoading: isRoutineLoading } = useRoutine(calendarDay?.routine_id ?? undefined);
  const markDayFree = useMarkDayFree(userId);
  const updateCalendarDay = useUpdateCalendarDay(userId);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval>(null);

  function handleAssignPlan() {
    router.push({ pathname: '/(app)/(tabs)/calendario/asignar-plan', params: { date: dateKey } });
  }

  function handleAssignRoutine() {
    router.push({ pathname: '/(app)/(tabs)/calendario/asignar-rutina', params: { date: dateKey } });
  }

  function handleConfirmRemoval() {
    if (!calendarDay || !pendingRemoval) return;
    const updates =
      pendingRemoval === 'plan' ? { plan_id: null } : pendingRemoval === 'free' ? { is_free: false } : { routine_id: null };
    updateCalendarDay.mutate(
      { id: calendarDay.id, date: dateKey, updates },
      { onSuccess: () => setPendingRemoval(null) },
    );
  }

  const removalCopy =
    pendingRemoval === 'routine'
      ? '¿Seguro que quieres quitar la rutina asignada a este día?'
      : '¿Seguro que quieres quitar la asignación de este día?';

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <ThemedText type="subtitle">{formatDisplayDate(date)}</ThemedText>

        <View style={styles.section}>
          <ThemedText type="smallBold">Plan del día</ThemedText>
          {isLoading ? (
            <ActivityIndicator color={theme.primary} />
          ) : !calendarDay || (!calendarDay.is_free && !calendarDay.plan_id) ? (
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
              <Button title="Quitar" variant="ghost" onPress={() => setPendingRemoval('free')} />
            </View>
          ) : isPlanLoading || !plan ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <>
              <AssignedPlanSummary
                plan={plan}
                onEdit={() => router.push(`/(app)/(tabs)/despensa/planes/${plan.id}`)}
                onRemove={() => setPendingRemoval('plan')}
              />
              <DailyTrackingSection plan={plan} calendarDayId={calendarDay.id} userId={userId} />
            </>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold">Entrenamiento del día</ThemedText>
          {isLoading ? (
            <ActivityIndicator color={theme.primary} />
          ) : !calendarDay?.routine_id ? (
            <View style={styles.actions}>
              <ThemedText type="default" themeColor="textSecondary">
                Todavía no has asignado una rutina.
              </ThemedText>
              <Button title="Asignar rutina" variant="secondary" onPress={handleAssignRoutine} />
            </View>
          ) : isRoutineLoading || !routine ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <AssignedRoutineSummary
              routine={routine}
              onEdit={() => router.push(`/(app)/(tabs)/entrenamiento/rutinas/${routine.id}`)}
              onRemove={() => setPendingRemoval('routine')}
            />
          )}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={pendingRemoval !== null}
        title="Quitar asignación"
        description={removalCopy}
        confirmLabel="Quitar"
        loading={updateCalendarDay.isPending}
        onConfirm={handleConfirmRemoval}
        onCancel={() => setPendingRemoval(null)}
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
    gap: 28,
  },
  section: {
    gap: 12,
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
