import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS — server-only, never import from
 * client components. Used for one-off admin provisioning, not request-path
 * reads/writes (those go through the session-scoped client + RLS).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
