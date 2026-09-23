import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseConfig, sanitizeSupabaseUrl, isSupabaseConfigured } from './config';

let clientInstance: SupabaseClient | null = null;

/**
 * Creates or retrieves a singleton browser Supabase client.
 * Validates that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set and non-placeholder.
 * Guarantees createClient receives a bare URL without /rest/v1/ or trailing slashes.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (clientInstance) return clientInstance;

  const { url, key } = validateSupabaseConfig(false);
  const bareUrl = sanitizeSupabaseUrl(url);
  clientInstance = createClient(bareUrl, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });

  return clientInstance;
}

export { isSupabaseConfigured };
