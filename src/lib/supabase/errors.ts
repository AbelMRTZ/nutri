import type { PostgrestError } from '@supabase/supabase-js';

/** Postgres SQLSTATE for a foreign-key constraint violation. */
const FOREIGN_KEY_VIOLATION = '23503';

export function isForeignKeyViolation(error: unknown): error is PostgrestError {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as PostgrestError).code === FOREIGN_KEY_VIOLATION
  );
}

/**
 * Turns a delete-mutation error into a friendly Spanish message. Callers
 * supply the entity-specific "in use" copy; every other error falls back to
 * a generic message instead of surfacing a raw Postgres error to the user.
 */
export function friendlyDeleteErrorMessage(error: unknown, inUseMessage: string): string {
  return isForeignKeyViolation(error) ? inUseMessage : 'No se ha podido eliminar. Inténtalo de nuevo.';
}
