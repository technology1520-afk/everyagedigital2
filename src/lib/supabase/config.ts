/**
 * Supabase Environment Configuration & Validator
 *
 * Verifies that NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 * and SUPABASE_SERVICE_ROLE_KEY are properly configured and not left as placeholders.
 */

const PLACEHOLDER_VALUES = [
  'PASTE_YOUR_ANON_KEY_HERE',
  'PASTE_YOUR_SERVICE_ROLE_KEY_HERE',
  'your_supabase_anon_key',
  'your_supabase_service_role_key',
  ''
];

function isPlaceholder(value?: string | null): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  return PLACEHOLDER_VALUES.includes(trimmed) || trimmed.startsWith('PASTE_YOUR_');
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return {
    url,
    anonKey,
    serviceRoleKey,
    hasValidUrl: Boolean(url && !isPlaceholder(url)),
    hasValidAnonKey: Boolean(anonKey && !isPlaceholder(anonKey)),
    hasValidServiceKey: Boolean(serviceRoleKey && !isPlaceholder(serviceRoleKey))
  };
}

export function isSupabaseConfigured(): boolean {
  const { hasValidUrl, hasValidAnonKey } = getSupabaseEnv();
  return hasValidUrl && hasValidAnonKey;
}

export function isSupabaseAdminConfigured(): boolean {
  const { hasValidUrl, hasValidServiceKey } = getSupabaseEnv();
  return hasValidUrl && hasValidServiceKey;
}

/**
 * Validates Supabase environment variables and throws descriptive errors
 * to prevent silent failures or unintended fallback to mock data.
 */
export function validateSupabaseConfig(requireAdmin: boolean = false): {
  url: string;
  key: string;
} {
  const env = getSupabaseEnv();

  if (!env.url || isPlaceholder(env.url)) {
    throw new Error(
      '[Supabase Configuration Error] NEXT_PUBLIC_SUPABASE_URL is missing or set to placeholder. ' +
      'Please check your .env.local or Vercel environment variables.'
    );
  }

  if (requireAdmin) {
    if (!env.serviceRoleKey || isPlaceholder(env.serviceRoleKey)) {
      throw new Error(
        '[Supabase Configuration Error] SUPABASE_SERVICE_ROLE_KEY is missing or set to placeholder. ' +
        'Admin/server operations require a valid service role key from your Supabase dashboard.'
      );
    }
    return { url: env.url, key: env.serviceRoleKey };
  }

  if (!env.anonKey || isPlaceholder(env.anonKey)) {
    throw new Error(
      '[Supabase Configuration Error] NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or set to placeholder. ' +
      'Client operations require a valid anon key from your Supabase dashboard.'
    );
  }

  return { url: env.url, key: env.anonKey };
}
