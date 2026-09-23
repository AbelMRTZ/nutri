import { listCalendarDaysInRange } from '@/features/calendar/api/calendarDays';
import { listPlanItems, type PlanItemWithDetails } from '@/features/plans/api/planItems';
import { buildCalendarExportRows, type CalendarExportRow } from '@/features/settings/calculations/buildExportRows';
import type { Tables } from '@/lib/supabase/database.types';

/**
 * Fetches every calendar_days row in the range, then resolves each distinct
 * assigned plan's meals/foods (deduped — the same plan can be assigned to
 * several days in the range) before flattening it all into export rows.
 */
export async function fetchCalendarExportRows(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<CalendarExportRow[]> {
  const calendarDays = await listCalendarDaysInRange(userId, startDate, endDate);
  const calendarDaysByDate = new Map<string, Tables<'calendar_days'>>(calendarDays.map((day) => [day.date, day]));

  const planIds = Array.from(new Set(calendarDays.map((day) => day.plan_id).filter((id): id is string => id !== null)));
  const planItemsEntries = await Promise.all(
    planIds.map(async (planId) => [planId, await listPlanItems(planId)] as const),
  );
  const planItemsByPlanId = new Map<string, PlanItemWithDetails[]>(planItemsEntries);

  return buildCalendarExportRows(startDate, endDate, calendarDaysByDate, planItemsByPlanId);
}
