import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCalendarDay } from '@/features/calendar/api/calendarDays';
import { listCompletionsForDay, markMealCompleted, unmarkMealCompleted } from '@/features/calendar/api/planItemCompletions';
import { calendarDayQueryKey } from '@/features/calendar/hooks/useCalendarDay';
import { calendarDayCompletionsQueryKey } from '@/features/calendar/hooks/useCalendarDayCompletions';
import { createPlanInstance, deletePlan } from '@/features/plans';
import type { Tables } from '@/lib/supabase/database.types';

export type EditPlanFromCalendarArgs = {
  calendarDayId: string;
  date: string;
  currentPlan: Tables<'plans'>;
};

/**
 * "Editar" from the calendar must never mutate the shared template plan (or
 * any other day it's assigned to). If the day's currently-assigned plan is
 * already a private is_calendar_instance, edit it in place. Otherwise fork
 * it once here: clone the plan, migrate this day's completions onto the
 * fork's plan_items, and repoint the day at the fork.
 */
export function useEditPlanFromCalendar(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ calendarDayId, currentPlan }: EditPlanFromCalendarArgs) => {
      if (currentPlan.is_calendar_instance) return currentPlan.id;

      const { plan: newPlan, planItemIdMap } = await createPlanInstance(currentPlan);

      try {
        const oldCompletions = await listCompletionsForDay(calendarDayId);
        for (const completion of oldCompletions) {
          const newPlanItemId = planItemIdMap.get(completion.plan_item_id);
          if (newPlanItemId) await markMealCompleted(calendarDayId, newPlanItemId);
          await unmarkMealCompleted(calendarDayId, completion.plan_item_id);
        }
        await updateCalendarDay(calendarDayId, { plan_id: newPlan.id });
      } catch (error) {
        await deletePlan(newPlan.id).catch(() => {});
        throw error;
      }

      return newPlan.id;
    },
    onSuccess: (_newPlanId, { calendarDayId, date }) => {
      queryClient.invalidateQueries({ queryKey: calendarDayQueryKey(userId, date) });
      queryClient.invalidateQueries({ queryKey: calendarDayCompletionsQueryKey(calendarDayId) });
      queryClient.invalidateQueries({ queryKey: ['calendar-days-range', userId] });
    },
  });
}
