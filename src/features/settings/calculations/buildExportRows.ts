import { calculateFoodContribution } from '@/features/foods/calculations/contribution';
import { foodCategoryLabels } from '@/features/foods/schema';
import { mealCategoryLabels } from '@/features/meals/schema';
import type { PlanItemWithDetails } from '@/features/plans/api/planItems';
import { addDays, formatWeekdayLong, fromDateKey, toDateKey } from '@/lib/dates';
import type { Tables } from '@/lib/supabase/database.types';

export type CalendarExportRow = {
  date: Date;
  weekday: string;
  meal: string | null;
  category: string | null;
  foodId: string | null;
  food: string | null;
  foodCategory: string | null;
  quantity: number | null;
  unit: string | null;
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
};

function emptyRow(date: Date, weekday: string, meal: string): CalendarExportRow {
  return {
    date,
    weekday,
    meal,
    category: null,
    foodId: null,
    food: null,
    foodCategory: null,
    quantity: null,
    unit: null,
    kcal: null,
    protein_g: null,
    carbs_g: null,
    fat_g: null,
  };
}

/**
 * One row per (día, comida, alimento) across a date range — flat and
 * sortable/filterable in a spreadsheet, rather than a nested/merged layout
 * that's fragile to generate and to verify. A day with no calendar_days row,
 * a free day, or a plan with no meals/foods yet still gets exactly one row
 * so the exported range has no silent gaps.
 */
export function buildCalendarExportRows(
  startDate: string,
  endDate: string,
  calendarDaysByDate: Map<string, Tables<'calendar_days'>>,
  planItemsByPlanId: Map<string, PlanItemWithDetails[]>,
): CalendarExportRow[] {
  const rows: CalendarExportRow[] = [];
  let cursor = fromDateKey(startDate);

  while (toDateKey(cursor) <= endDate) {
    const dateKey = toDateKey(cursor);
    const date = cursor;
    const weekday = formatWeekdayLong(date);
    const day = calendarDaysByDate.get(dateKey);

    if (!day || (!day.plan_id && !day.is_free)) {
      rows.push(emptyRow(date, weekday, 'Sin planificar'));
    } else if (day.is_free) {
      rows.push(emptyRow(date, weekday, 'Día libre'));
    } else {
      const items = planItemsByPlanId.get(day.plan_id as string);

      if (!items || items.length === 0) {
        rows.push(emptyRow(date, weekday, 'Plan sin comidas asignadas'));
      } else {
        for (const item of items) {
          if (item.plan_item_foods.length === 0) {
            rows.push({ ...emptyRow(date, weekday, item.meal.name), category: mealCategoryLabels[item.meal.category] });
            continue;
          }

          for (const pif of item.plan_item_foods) {
            const contribution = calculateFoodContribution(pif.food, pif.quantity);
            rows.push({
              date,
              weekday,
              meal: item.meal.name,
              category: mealCategoryLabels[item.meal.category],
              foodId: pif.food.id,
              food: pif.food.name,
              foodCategory: foodCategoryLabels[pif.food.category],
              quantity: pif.quantity,
              unit: pif.food.serving_type === 'per_unit' ? 'unidades' : 'g',
              kcal: contribution.energy_kcal,
              protein_g: contribution.protein_g,
              carbs_g: contribution.carbs_g,
              fat_g: contribution.fat_g,
            });
          }
        }
      }
    }

    cursor = addDays(cursor, 1);
  }

  return rows;
}

/** Inclusive day count of a `YYYY-MM-DD` range — 0 or negative means `endDate` is before `startDate`. */
export function countDaysInclusive(startDate: string, endDate: string): number {
  const start = fromDateKey(startDate);
  const end = fromDateKey(endDate);
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

export type ShoppingListRow = {
  food: string;
  foodCategory: string | null;
  quantity: number;
  unit: string;
};

/**
 * Sums a food's quantity across every meal/day it appears in over the
 * exported range — grouped by `foodId`, never by name, so two different
 * foods that happen to share a name (e.g. two USDA "Kale, raw" entries, or
 * a personal food re-created with the same name as another) are never
 * merged into one shopping-list line. A food's unit is intrinsic to it
 * (its `serving_type` never changes between rows), so summing is always
 * apples-to-apples — never grams mixed with units under one line.
 */
export function buildShoppingListRows(calendarRows: CalendarExportRow[]): ShoppingListRow[] {
  const totals = new Map<string, ShoppingListRow>();

  for (const row of calendarRows) {
    if (!row.foodId || !row.food || row.quantity === null || !row.unit) continue;

    const existing = totals.get(row.foodId);
    if (existing) {
      existing.quantity += row.quantity;
    } else {
      totals.set(row.foodId, { food: row.food, foodCategory: row.foodCategory, quantity: row.quantity, unit: row.unit });
    }
  }

  return Array.from(totals.values())
    .map((entry) => ({ ...entry, quantity: Math.round(entry.quantity * 100) / 100 }))
    .sort((a, b) => {
      const categoryOrder = (a.foodCategory ?? '').localeCompare(b.foodCategory ?? '', 'es');
      return categoryOrder !== 0 ? categoryOrder : a.food.localeCompare(b.food, 'es');
    });
}
