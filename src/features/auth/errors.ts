/**
 * Maps known Supabase Auth error messages to friendly Spanish copy. Auth
 * errors surface as plain Error instances with GoTrue's English message —
 * there's no structured error code exposed client-side the way
 * PostgrestError has `code`, so this matches on message substrings instead.
 */
export function friendlyAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  if (message.includes('email not confirmed')) {
    return 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada (y la carpeta de spam).';
  }
  if (message.includes('invalid login credentials')) {
    return 'Email o contraseña incorrectos.';
  }
  if (message.includes('already registered') || message.includes('user already exists')) {
    return 'Ya existe una cuenta con este email.';
  }
  if (message.includes('rate limit') || message.includes('too many requests') || message.includes('security purposes')) {
    return 'Demasiados intentos seguidos. Espera un momento antes de volver a intentarlo.';
  }
  if (message.includes('password')) {
    return 'La contraseña no es válida. Debe tener al menos 6 caracteres.';
  }

  return error instanceof Error && error.message ? error.message : 'Ha ocurrido un error. Inténtalo de nuevo.';
}
