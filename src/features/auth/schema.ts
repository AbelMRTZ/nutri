import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Introduce un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type CredentialsFormValues = z.infer<typeof credentialsSchema>;
