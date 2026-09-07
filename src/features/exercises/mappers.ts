import type { Tables } from '@/lib/supabase/database.types';

import type { ExerciseFormValues } from './schema';

export function toFormDefaults(row: Tables<'exercises'> | undefined): Partial<ExerciseFormValues> {
  if (!row) return {};

  return {
    name: row.name,
    muscle_group: row.muscle_group,
    equipment: row.equipment,
  };
}
