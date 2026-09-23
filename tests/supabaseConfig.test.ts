import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  getSupabaseEnv, 
  isSupabaseConfigured, 
  isSupabaseAdminConfigured, 
  validateSupabaseConfig 
} from '../src/lib/supabase/config';

describe('Supabase Environment Configuration & Validator', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('detects missing environment variables', () => {
    const env = getSupabaseEnv();
    expect(env.hasValidUrl).toBe(false);
    expect(env.hasValidAnonKey).toBe(false);
    expect(env.hasValidServiceKey).toBe(false);
    expect(isSupabaseConfigured()).toBe(false);
    expect(isSupabaseAdminConfigured()).toBe(false);
  });

  it('detects placeholder keys and prevents silent usage', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://wlfwdbusmzgdiryhtdki.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_KEY_HERE';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE';

    const env = getSupabaseEnv();
    expect(env.hasValidUrl).toBe(true);
    expect(env.hasValidAnonKey).toBe(false);
    expect(env.hasValidServiceKey).toBe(false);

    expect(() => validateSupabaseConfig(false)).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or set to placeholder/);
    expect(() => validateSupabaseConfig(true)).toThrow(/SUPABASE_SERVICE_ROLE_KEY is missing or set to placeholder/);
  });

  it('throws descriptive error if URL is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-anon-key-12345';
    expect(() => validateSupabaseConfig(false)).toThrow(/NEXT_PUBLIC_SUPABASE_URL is missing or set to placeholder/);
  });

  it('validates successfully when legitimate keys are provided', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://wlfwdbusmzgdiryhtdki.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-anon-jwt-token';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'valid-service-role-jwt-token';

    expect(isSupabaseConfigured()).toBe(true);
    expect(isSupabaseAdminConfigured()).toBe(true);

    const clientConfig = validateSupabaseConfig(false);
    expect(clientConfig.url).toBe('https://wlfwdbusmzgdiryhtdki.supabase.co');
    expect(clientConfig.key).toBe('valid-anon-jwt-token');

    const adminConfig = validateSupabaseConfig(true);
    expect(adminConfig.url).toBe('https://wlfwdbusmzgdiryhtdki.supabase.co');
    expect(adminConfig.key).toBe('valid-service-role-jwt-token');
  });

  it('sanitizes trailing slashes, /rest/v1 paths, and surrounding quotes to ensure bare URL', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '"https://wlfwdbusmzgdiryhtdki.supabase.co/rest/v1/"';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '"valid-anon-key-12345"';

    const env = getSupabaseEnv();
    expect(env.url).toBe('https://wlfwdbusmzgdiryhtdki.supabase.co');
    expect(env.anonKey).toBe('valid-anon-key-12345');

    const config = validateSupabaseConfig(false);
    expect(config.url).toBe('https://wlfwdbusmzgdiryhtdki.supabase.co');
    expect(config.url).not.toContain('/rest/v1');
    expect(config.url.endsWith('/')).toBe(false);
  });

  it('guarantees getSupabaseServerClient and getSupabaseAdminClient create queries without double rest path', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://wlfwdbusmzgdiryhtdki.supabase.co/rest/v1/';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-anon-key-12345';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'valid-service-role-key-12345';

    const { getSupabaseServerClient, getSupabaseAdminClient } = await import('../src/lib/supabase/server');

    const serverClient = getSupabaseServerClient();
    const adminClient = getSupabaseAdminClient();

    // Verify generated query URL doesn't have duplicate /rest/v1/rest/v1
    const serverQueryUrl = serverClient.from('products').url.toString();
    const adminQueryUrl = adminClient.from('products').url.toString();

    expect(serverQueryUrl).toBe('https://wlfwdbusmzgdiryhtdki.supabase.co/rest/v1/products');
    expect(adminQueryUrl).toBe('https://wlfwdbusmzgdiryhtdki.supabase.co/rest/v1/products');
    expect(serverQueryUrl).not.toContain('/rest/v1/rest/v1');
    expect(adminQueryUrl).not.toContain('/rest/v1/rest/v1');
  });
});
