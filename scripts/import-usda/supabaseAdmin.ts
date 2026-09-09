import { createClient } from '@supabase/supabase-js';

import type { Database } from '../../src/lib/supabase/database.types';

// Node-only client for this script — deliberately NOT the app's
// `src/lib/supabase/client.ts` (that one pulls in React Native polyfills,
// secure-storage auth persistence, and an AppState listener, none of which
// exist outside the Expo runtime). Uses the service role key, which
// bypasses RLS entirely, so this must never run anywhere near the app
// bundle — it's a standalone Node script only.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set both in .env before running the import.',
  );
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
