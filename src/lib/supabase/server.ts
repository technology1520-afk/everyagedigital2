import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  validateSupabaseConfig, 
  sanitizeSupabaseUrl,
  isSupabaseConfigured, 
  isSupabaseAdminConfigured 
} from './config';

/**
 * Creates a server-side Supabase client using the public anon key.
 * Used for standard user-scoped queries and server component reads.
 * Guarantees createClient receives a bare URL without /rest/v1/ or trailing slashes.
 */
export function getSupabaseServerClient(): SupabaseClient {
  const { url, key } = validateSupabaseConfig(false);
  const bareUrl = sanitizeSupabaseUrl(url);
  return createClient(bareUrl, key, {
    auth: {
      persistSession: false
    }
  });
}

/**
 * Creates an admin Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses Row Level Security (RLS) for server actions, batch jobs, and MCP handlers.
 * Throws immediately if SUPABASE_SERVICE_ROLE_KEY is missing or a placeholder.
 * Guarantees createClient receives a bare URL without /rest/v1/ or trailing slashes.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  const { url, key } = validateSupabaseConfig(true);
  const bareUrl = sanitizeSupabaseUrl(url);
  return createClient(bareUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export { isSupabaseConfigured, isSupabaseAdminConfigured };
