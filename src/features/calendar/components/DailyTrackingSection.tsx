import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { DailyScoreSummary } from '@/features/calendar/components/DailyScoreSummary';
import { MealCompletionList } from '@/features/calendar/components/MealCompletionList';
import { useCalendarDayCompletions } from '@/features/calendar/hooks/useCalendarDayCompletions';
import { useToggleMealCompletion } from '@/features/calendar/hooks/useToggleMealCompletion';
import { usePlanItems } from '@/features/plans';
import { calculatePlanTotals } from '@/features/plans/calculations/totals';
import { useProfile } from '@/features/profile';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

export type DailyTrackingSectionProps = {
  plan: Tables<'plans'>;
  calendarDayId: string;
  userId: string | undefined;
};

/** Meal checklist + consumed-vs-target progress and score for an assigned day. */
export function DailyTrackingSection({ plan, calendarDayId, userId }: DailyTrackingSectionProps) {
  const theme = useTheme();
  const { data: planItems, isLoading } = usePlanItems(plan.id);
  const { data: completions } = useCalendarDayCompletions(calendarDayId);
  const { data: profile } = useProfile(userId);
  const toggleCompletion = useToggleMealCompletion(calendarDayId);

  if (isLoading) {
    return <ActivityIndicator color={theme.primary} />;
  }

  if (!planItems || planItems.length === 0) {
    return null;
  }

  const completedIds = new Set((completions ?? []).map((completion) => completion.plan_item_id));
  const consumedTotals = calculatePlanTotals(
    planItems
      .filter((item) => completedIds.has(item.id))
      .flatMap((item) => item.plan_item_foods.map((pif) => ({ food: pif.food, quantity: pif.quantity }))),
  );
  const targets = plan.is_special
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

  return (
    <View style={styles.container}>
      <MealCompletionList
        items={planItems}
        completedIds={completedIds}
        pendingId={toggleCompletion.isPending ? toggleCompletion.variables?.planItemId : undefined}
        onToggle={(planItemId, completed) => toggleCompletion.mutate({ planItemId, completed })}
      />
      <DailyScoreSummary totals={consumedTotals} targets={targets} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
