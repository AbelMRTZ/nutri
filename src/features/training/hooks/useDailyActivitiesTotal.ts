import { useDayActivities } from '@/features/training/hooks/useDayActivities';

/** Sum of calories_burned for a date — used to bump that day's calorie target. */
export function useDailyActivitiesTotal(userId: string | undefined, date: string | undefined) {
  const { data: activities, isLoading } = useDayActivities(userId, date);
  const total = (activities ?? []).reduce((sum, activity) => sum + activity.calories_burned, 0);
  return { data: total, isLoading };
}
