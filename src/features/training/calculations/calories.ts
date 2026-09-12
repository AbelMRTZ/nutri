import type { ActivityType, EffortLevel } from '@/features/training/schema';

/**
 * Shared calorie-burn formula for every activity type:
 * kcal = (MET - 1) x Peso(kg) x (Minutos/60). Only how MET is derived
 * differs per activity — the arithmetic itself is identical, so it lives in
 * one function rather than three near-duplicates.
 */
export function calculateActivityCalories(met: number, weightKg: number, durationMinutes: number): number {
  return (met - 1) * weightKg * (durationMinutes / 60);
}

export const STRENGTH_MET: Record<'light' | 'moderate' | 'intense', number> = {
  light: 3.5,
  moderate: 5,
  intense: 6,
};

export const HIKING_MET: Record<'easy' | 'moderate' | 'demanding' | 'trail', number> = {
  easy: 3.5,
  moderate: 5.3,
  demanding: 6,
  trail: 9,
};

/** Running MET by speed, ordered by speedKmh ascending — see interpolateRunningMet. */
export const RUNNING_MET_TABLE: { speedKmh: number; met: number }[] = [
  { speedKmh: 8.0, met: 8.3 },
  { speedKmh: 8.4, met: 9.0 },
  { speedKmh: 9.6, met: 9.8 },
  { speedKmh: 10.8, met: 10.5 },
  { speedKmh: 11.3, met: 11.0 },
  { speedKmh: 12.0, met: 11.5 },
  { speedKmh: 12.9, met: 11.8 },
  { speedKmh: 13.8, met: 12.3 },
  { speedKmh: 14.5, met: 12.8 },
  { speedKmh: 16.0, met: 14.5 },
  { speedKmh: 17.7, met: 16.0 },
  { speedKmh: 19.3, met: 19.0 },
  { speedKmh: 22.5, met: 23.0 },
];

/**
 * MET for a running speed that (almost always) falls between two of the
 * table's points: linearly interpolated between the nearest pair straddling
 * it. Speeds at or beyond either end of the table clamp to that endpoint's
 * MET rather than extrapolating — the table has no data past its edges.
 */
export function interpolateRunningMet(speedKmh: number): number {
  const table = RUNNING_MET_TABLE;
  if (speedKmh <= table[0].speedKmh) return table[0].met;
  if (speedKmh >= table[table.length - 1].speedKmh) return table[table.length - 1].met;

  for (let i = 0; i < table.length - 1; i++) {
    const lower = table[i];
    const upper = table[i + 1];
    if (speedKmh >= lower.speedKmh && speedKmh <= upper.speedKmh) {
      const ratio = (speedKmh - lower.speedKmh) / (upper.speedKmh - lower.speedKmh);
      return lower.met + ratio * (upper.met - lower.met);
    }
  }

  // Unreachable given the clamps above, but keeps the function total.
  return table[table.length - 1].met;
}

/** distancia/tiempo, en km/h, a partir de distancia (km) y duración (minutos). */
export function calculateRunningSpeedKmh(distanceKm: number, durationMinutes: number): number {
  return distanceKm / (durationMinutes / 60);
}

/**
 * Resolves the MET to use for an activity from its type-specific inputs —
 * shared by the live form preview and by re-applying a saved template, so
 * both always derive MET the same way. Returns `null` when the inputs
 * needed for that activity_type aren't present yet (e.g. mid-edit in the
 * form), rather than throwing.
 */
export function resolveMet(
  activityType: ActivityType,
  params: { effortLevel?: EffortLevel | null; distanceKm?: number | null; durationMinutes?: number | null },
): number | null {
  if (activityType === 'running') {
    if (params.distanceKm == null || !params.durationMinutes) return null;
    return interpolateRunningMet(calculateRunningSpeedKmh(params.distanceKm, params.durationMinutes));
  }
  if (!params.effortLevel) return null;
  if (activityType === 'strength') return STRENGTH_MET[params.effortLevel as keyof typeof STRENGTH_MET] ?? null;
  return HIKING_MET[params.effortLevel as keyof typeof HIKING_MET] ?? null;
}
