import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createActivity } from '@/features/training/api/calendarActivities';
import { calculateActivityCalories, resolveMet } from '@/features/training/calculations/calories';
import { dayActivitiesQueryKey } from '@/features/training/hooks/useDayActivities';
import type { Tables } from '@/lib/supabase/database.types';

export type ApplySavedActivityInput = {
  template: Tables<'saved_activities'>;
  date: string;
  /** Current profile weight — required to re-run an auto-mode template's formula; ignored for manual ones. */
  weightKg: number | null;
};

/**
 * Materializes a saved template into a real day activity. For an auto-mode
 * template this always RECALCULATES kcal from the current profile weight —
 * never reuses the template's frozen preview value, which may be stale if
 * the user's weight changed since the template was saved.
 */
export function useApplySavedActivity(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ template, date, weightKg }: ApplySavedActivityInput) => {
      if (template.calculation_mode === 'manual') {
        return createActivity({
          user_id: userId as string,
          date,
          activity_type: template.activity_type,
          name: template.name,
          calculation_mode: 'manual',
          calories_burned: template.calories_burned,
          duration_minutes: template.duration_minutes,
          distance_km: template.distance_km,
          effort_level: template.effort_level,
        });
      }

      if (weightKg == null) {
        throw new Error('Añade tu peso en tu perfil para aplicar este entreno automático.');
      }
      const met = resolveMet(template.activity_type, {
        effortLevel: template.effort_level,
        distanceKm: template.distance_km,
        durationMinutes: template.duration_minutes,
      });
      if (met === null || !template.duration_minutes) {
        throw new Error('Esta plantilla no tiene datos suficientes para calcular el gasto.');
      }
      const caloriesBurned = calculateActivityCalories(met, weightKg, template.duration_minutes);

      return createActivity({
        user_id: userId as string,
        date,
        activity_type: template.activity_type,
        name: template.name,
        calculation_mode: 'auto',
        calories_burned: Math.round(caloriesBurned * 10) / 10,
        duration_minutes: template.duration_minutes,
        distance_km: template.distance_km,
        effort_level: template.effort_level,
        met_value: Math.round(met * 100) / 100,
        weight_kg_used: weightKg,
      });
    },
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: dayActivitiesQueryKey(userId, activity.date) });
      queryClient.invalidateQueries({ queryKey: ['activity-dates-range', userId] });
    },
  });
}
