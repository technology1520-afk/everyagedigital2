import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseConfig, isSupabaseConfigured } from './config';

let clientInstance: SupabaseClient | null = null;

/**
 * Creates or retrieves a singleton browser Supabase client.
 * Validates that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set and non-placeholder.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (clientInstance) return clientInstance;

  const { url, key } = validateSupabaseConfig(false);
  clientInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });

  return clientInstance;
}

export { isSupabaseConfigured };
