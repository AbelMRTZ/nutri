import { z } from 'zod';

/** Same bounds as profile's weight_kg (schema.ts in `profile`) — the two are unrelated tables, but a plausible human weight is a plausible human weight either way. */
export const weightLogFormSchema = z.object({
  weight_kg: z.number({ message: 'Indica tu peso' }).min(30, 'Peso mínimo: 30 kg').max(300, 'Peso máximo: 300 kg'),
});

export type WeightLogFormValues = z.infer<typeof weightLogFormSchema>;
