import { z } from 'zod';

export const routineFormSchema = z.object({
  name: z.string({ message: 'Indica un nombre' }).trim().min(1, 'Indica un nombre').max(120),
});

export type RoutineFormValues = z.infer<typeof routineFormSchema>;

/** Pure validity checks for the inline sets/reps/weight edits — no per-row RHF instance needed. */
export function isValidSets(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidReps(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidWeight(value: number): boolean {
  return value >= 0;
}
