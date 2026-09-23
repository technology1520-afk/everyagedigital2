import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseConfig, isSupabaseConfigured, isSupabaseAdminConfigured } from './config';

/**
 * Creates a server-side Supabase client using the public anon key.
 * Used for standard user-scoped queries and server component reads.
 */
export function getSupabaseServerClient(): SupabaseClient {
  const { url, key } = validateSupabaseConfig(false);
  return createClient(url, key, {
    auth: {
      persistSession: false
    }
  });
}

/**
 * Creates an admin Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses Row Level Security (RLS) for server actions, batch jobs, and MCP handlers.
 * Throws immediately if SUPABASE_SERVICE_ROLE_KEY is missing or a placeholder.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  const { url, key } = validateSupabaseConfig(true);
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export { isSupabaseConfigured, isSupabaseAdminConfigured };
