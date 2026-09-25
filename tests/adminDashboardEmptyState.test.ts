import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { catalogRepository } from '../src/lib/db/repository';
import { handleStoreStats } from '../src/lib/mcp/handlers';
import * as serverModule from '../src/lib/supabase/server';

describe('Admin Dashboard & MCP Telemetry Empty Database State', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-test-service-key';
    catalogRepository.reset();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('guarantees dashboard stats return zeroes and no mock fallback when Supabase returns 0 products', async () => {
    // Mock Supabase returning empty array []
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [], error: null })
      })
    };
    vi.spyOn(serverModule, 'getSupabaseAdminClient').mockReturnValue(mockSupabase as any);

    const products = await catalogRepository.getAllProducts();
    expect(products).toEqual([]);

    const stats = catalogRepository.getDashboardStats();
    expect(stats.totalActiveProducts).toBe(0);
    expect(stats.topProduct).toBeUndefined();
    expect(stats.staleProducts).toEqual([]);
    expect(stats.topProducts).toEqual([]);
    expect(stats.clicksLast7d).toBe(0);
    expect(stats.clicksLast30d).toBe(0);
  });

  it('store_stats MCP tool queries real database count rather than falling back to mock data when empty', async () => {
    // Mock Supabase select('status') returning empty array []
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [], error: null })
      })
    };
    vi.spyOn(serverModule, 'getSupabaseAdminClient').mockReturnValue(mockSupabase as any);

    const response = await handleStoreStats({});
    expect(response.ok).toBe(true);
    if (response.ok) {
      const data = response.data as any;
      expect(data.products_by_status).toEqual({
        draft: 0,
        active: 0,
        paused: 0,
        archived: 0
      });
      expect(data.clicks_7d).toBe(0);
      expect(data.clicks_30d).toBe(0);
      expect(data.assistant_conversations_7d).toBe(0);
    }
  });

  it('getProductById and getProductBySlug do not fall back to mock data when not found in Supabase', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      })
    };
    vi.spyOn(serverModule, 'getSupabaseAdminClient').mockReturnValue(mockSupabase as any);

    const byId = await catalogRepository.getProductById('prod-1');
    expect(byId).toBeUndefined();

    const bySlug = await catalogRepository.getProductBySlug('benq-screenbar-plus');
    expect(bySlug).toBeUndefined();
  });
});
