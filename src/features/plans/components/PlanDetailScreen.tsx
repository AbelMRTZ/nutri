import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ErrorBanner } from '@/components/error-banner';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { PromptDialog } from '@/components/prompt-dialog';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { applyCaloriesBurnedToTargets } from '@/features/calendar/calculations/targets';
import type { PlanItemWithDetails } from '@/features/plans/api/planItems';
import { calculatePlanTotals } from '@/features/plans/calculations/totals';
import { PlanForm } from '@/features/plans/components/PlanForm';
import { PlanMealGroup } from '@/features/plans/components/PlanMealGroup';
import { PlanProgressSummary } from '@/features/plans/components/PlanProgressSummary';
import { useCalendarDayDateForPlan } from '@/features/plans/hooks/useCalendarDayDateForPlan';
import { useDeletePlan } from '@/features/plans/hooks/useDeletePlan';
import { usePlan } from '@/features/plans/hooks/usePlan';
import { usePlanItems } from '@/features/plans/hooks/usePlanItems';
import { useReorderPlanItems } from '@/features/plans/hooks/useReorderPlanItems';
import { useUpdatePlan } from '@/features/plans/hooks/useUpdatePlan';
import { toFormDefaults } from '@/features/plans/mappers';
import type { PlanFormValues } from '@/features/plans/schema';
import { useProfile } from '@/features/profile';
import { useDailyActivitiesTotal } from '@/features/training';
import { friendlyDeleteErrorMessage } from '@/lib/supabase/errors';

export type PlanDetailScreenProps = {
  id: string;
};

function swap<T>(list: T[], index: number, otherIndex: number): T[] {
  const next = [...list];
  [next[index], next[otherIndex]] = [next[otherIndex], next[index]];
  return next;
}

export function PlanDetailScreen({ id }: PlanDetailScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: plan, isLoading } = usePlan(id);
  const { data: planItems } = usePlanItems(id);
  const { data: profile } = useProfile(userId);
  const { data: calendarDate } = useCalendarDayDateForPlan(id, plan?.is_calendar_instance ?? false);
  const { data: caloriesBurned } = useDailyActivitiesTotal(userId, calendarDate ?? undefined);
  const updatePlan = useUpdatePlan(id, userId);
  const deletePlan = useDeletePlan(userId);
  const reorderPlanItems = useReorderPlanItems(id);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [promoteVisible, setPromoteVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  // Only holds a value while a reorder is in flight — cleared once the
  // mutation settles so the server's own (now-matching) order takes back
  // over, instead of an effect syncing local state from the query on every
  // change.
  const [pendingOrder, setPendingOrder] = useState<PlanItemWithDetails[] | null>(null);
  const orderedItems = pendingOrder ?? planItems ?? [];

  if (isLoading || !plan) {
    return <FullScreenSpinner />;
  }

  const totals = calculatePlanTotals(
    orderedItems.flatMap((item) => item.plan_item_foods.map((pif) => ({ food: pif.food, quantity: pif.quantity }))),
  );

  const baseTargets = plan.is_special
    ? {
        calories_target: plan.calories_target,
        protein_g_target: plan.protein_g_target,
        carbs_g_target: plan.carbs_g_target,
        fat_g_target: plan.fat_g_target,
      }
    : {
        calories_target: profile?.calories_target ?? null,
        protein_g_target: profile?.protein_g_target ?? null,
        carbs_g_target: profile?.carbs_g_target ?? null,
        fat_g_target: profile?.fat_g_target ?? null,
      };
  // Si esta es la instancia de un día del calendario, sus objetivos deben
  // reflejar el entrenamiento de ese mismo día — mismo cálculo que el panel
  // del Calendario (DailyTrackingSection), para que nunca diverjan. Para un
  // plan plantilla normal (no instancia), calendarDate/caloriesBurned se
  // quedan sin activar y esto es un no-op.
  const targets = applyCaloriesBurnedToTargets(baseTargets, caloriesBurned ?? 0);

  function handleSubmit(values: PlanFormValues) {
    const isSpecial = values.type === 'special';
    updatePlan.mutate({
      name: values.name,
      is_special: isSpecial,
      calories_target: isSpecial ? values.calories_target : null,
      protein_g_target: isSpecial ? values.protein_g_target : null,
      carbs_g_target: isSpecial ? values.carbs_g_target : null,
      fat_g_target: isSpecial ? values.fat_g_target : null,
    });
  }

  function handleDelete() {
    deletePlan.mutate(id, {
      onSuccess: () => router.back(),
      onError: (error) => {
        setDeleteError(
          friendlyDeleteErrorMessage(error, 'Este plan está asignado a un día del calendario y no se puede eliminar.'),
        );
        setConfirmVisible(false);
      },
    });
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedItems.length) return;

    const reordered = swap(orderedItems, index, nextIndex);
    setPendingOrder(reordered);
    reorderPlanItems.mutate(
      reordered.map((item, i) => ({ id: item.id, sort_order: i })),
      { onSettled: () => setPendingOrder(null) },
    );
  }

  return (
    <View style={styles.root}>
      <Screen scroll style={styles.content}>
        {plan.is_calendar_instance ? (
          <ThemedText type="small" themeColor="textSecondary">
            Estás editando una copia privada de este día. Los cambios no afectarán al plan original.
          </ThemedText>
        ) : null}

        <PlanForm
          defaultValues={toFormDefaults(plan)}
          onSubmit={handleSubmit}
          submitting={updatePlan.isPending}
          submitLabel="Guardar cambios"
        />

        <PlanProgressSummary totals={totals} targets={targets} />

        {plan.is_calendar_instance ? (
          <Button variant="secondary" title="Guardar como nuevo plan" onPress={() => setPromoteVisible(true)} />
        ) : (
          <Button
            variant="secondary"
            title="Programar en calendario"
            onPress={() =>
              router.push({ pathname: '/(app)/(tabs)/despensa/planes/programar-calendario', params: { planId: id } })
            }
          />
        )}

        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <ThemedText type="smallBold">Comidas</ThemedText>
            <Button
              variant="secondary"
              title="Añadir comida"
              onPress={() =>
                router.push({ pathname: '/(app)/(tabs)/despensa/planes/agregar-comida', params: { planId: id } })
              }
            />
          </View>

          {orderedItems.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              Todavía no has añadido ninguna comida.
            </ThemedText>
          ) : (
            <View style={styles.itemsList}>
              {orderedItems.map((item, index) => (
                <PlanMealGroup
                  key={item.id}
                  item={item}
                  planId={id}
                  canMoveUp={index > 0}
                  canMoveDown={index < orderedItems.length - 1}
                  onMoveUp={() => moveItem(index, -1)}
                  onMoveDown={() => moveItem(index, 1)}
                />
              ))}
            </View>
          )}
        </View>

        {plan.is_calendar_instance ? null : (
          <Button variant="ghost" title="Eliminar plan" onPress={() => setConfirmVisible(true)} />
        )}

        <ConfirmDialog
          visible={confirmVisible}
          title="Eliminar plan"
          description={`¿Seguro que quieres eliminar "${plan.name}"? Esta acción no se puede deshacer.`}
          loading={deletePlan.isPending}
          onConfirm={handleDelete}
          onCancel={() => setConfirmVisible(false)}
        />

        <PromptDialog
          visible={promoteVisible}
          title="Guardar como nuevo plan"
          label="Nombre"
          initialValue={`${plan.name} (copia)`}
          confirmLabel="Guardar"
          loading={updatePlan.isPending}
          onConfirm={(name) =>
            updatePlan.mutate(
              { name, is_calendar_instance: false },
              { onSuccess: () => setPromoteVisible(false) },
            )
          }
          onCancel={() => setPromoteVisible(false)}
        />
      </Screen>

      {deleteError ? <ErrorBanner message={deleteError} onDismiss={() => setDeleteError(undefined)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    gap: 24,
  },
  itemsSection: {
    gap: 8,
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemsList: {
    gap: 12,
  },
});
