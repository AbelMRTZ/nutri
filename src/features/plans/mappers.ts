import type { Tables } from '@/lib/supabase/database.types';

import type { PlanFormValues } from './schema';

export function toFormDefaults(row: Tables<'plans'> | undefined): Partial<PlanFormValues> {
  if (!row) return {};

  return {
    name: row.name,
    type: row.is_special ? 'special' : 'standard',
    calories_target: row.calories_target ?? undefined,
    protein_g_target: row.protein_g_target ?? undefined,
    carbs_g_target: row.carbs_g_target ?? undefined,
    fat_g_target: row.fat_g_target ?? undefined,
  };
}
