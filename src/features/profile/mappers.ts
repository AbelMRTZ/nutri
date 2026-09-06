import type { Tables } from '@/lib/supabase/database.types';

import type { ProfileFormValues } from './schema';

/** Supabase returns `null` for empty columns; RHF/NumericField expect `undefined`. */
export function toFormDefaults(row: Tables<'profiles'> | undefined): Partial<ProfileFormValues> {
  if (!row) return {};

  return {
    age: row.age ?? undefined,
    height_cm: row.height_cm ?? undefined,
    weight_kg: row.weight_kg ?? undefined,
    sex: row.sex ?? undefined,
    body_fat_pct: row.body_fat_pct ?? undefined,
    goal: row.goal ?? undefined,
    target_weight_kg: row.target_weight_kg ?? undefined,
    pace_kg_per_week: row.pace_kg_per_week ?? undefined,
    calories_target: row.calories_target ?? undefined,
    protein_g_target: row.protein_g_target ?? undefined,
    carbs_g_target: row.carbs_g_target ?? undefined,
    fat_g_target: row.fat_g_target ?? undefined,
  };
}
