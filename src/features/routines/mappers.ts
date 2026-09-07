import type { Tables } from '@/lib/supabase/database.types';

import type { RoutineFormValues } from './schema';

export function toFormDefaults(row: Tables<'routines'> | undefined): Partial<RoutineFormValues> {
  if (!row) return {};

  return {
    name: row.name,
  };
}
