import type { Tables } from '@/lib/supabase/database.types';

import type { MealFormValues } from './schema';

export function toFormDefaults(row: Tables<'meals'> | undefined): Partial<MealFormValues> {
  if (!row) return {};

  return {
    name: row.name,
    category: row.category,
  };
}
