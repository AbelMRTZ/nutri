import { z } from 'zod';

export const muscleGroupOptions = [
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'core',
  'cardio',
  'full_body',
  'other',
] as const;

export const muscleGroupLabels: Record<(typeof muscleGroupOptions)[number], string> = {
  chest: 'Pecho',
  back: 'Espalda',
  shoulders: 'Hombros',
  arms: 'Brazos',
  legs: 'Piernas',
  core: 'Core',
  cardio: 'Cardio',
  full_body: 'Cuerpo completo',
  other: 'Otro',
};

export const equipmentOptions = ['bodyweight', 'free_weights', 'machine', 'bands', 'cardio_machine', 'other'] as const;

export const equipmentLabels: Record<(typeof equipmentOptions)[number], string> = {
  bodyweight: 'Peso corporal',
  free_weights: 'Pesas libres',
  machine: 'Máquina',
  bands: 'Bandas',
  cardio_machine: 'Máquina de cardio',
  other: 'Otro',
};

export const exerciseFormSchema = z.object({
  name: z.string({ message: 'Indica un nombre' }).trim().min(1, 'Indica un nombre').max(120),
  muscle_group: z.enum(muscleGroupOptions, { message: 'Selecciona un grupo muscular' }),
  equipment: z.enum(equipmentOptions, { message: 'Selecciona el equipo' }),
});

export type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;
