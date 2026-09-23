import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { catalogRepository } from '../src/lib/db/repository';
import { searchCatalog } from '../src/lib/search/catalogSearch';
import { POST, GET } from '../src/app/api/mcp/route';
import { MCP_TOOLS } from '../src/lib/mcp/tools';
import { DEFAULT_MCP_TOKEN, resetMcpRateLimits, sanitizeErrorMessage } from '../src/lib/mcp/auth';

describe('Master MCP Server Specification & Verification', () => {
  const validToken = DEFAULT_MCP_TOKEN;

  function createMcpRequest(body: Record<string, unknown>, token: string | null = validToken): NextRequest {
    const headers: Record<string, string> = {
      'content-type': 'application/json'
    };
    if (token) {
      headers['authorization'] = `Bearer ${token}`;
    }

    return new NextRequest('http://localhost:3000/api/mcp', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  }

  beforeEach(() => {
    catalogRepository.reset();
    resetMcpRateLimits();
  });

  it('tools/list returns exactly 8 tools with valid JSON schemas', async () => {
    // Direct MCP definition check
    expect(MCP_TOOLS.length).toBe(8);
    const expectedNames = [
      'list_products',
      'add_product',
      'update_product',
      'set_product_status',
      'get_clicks',
      'mark_price_checked',
      'get_stale_prices',
      'store_stats'
    ];
    const toolNames = MCP_TOOLS.map(t => t.name);
    expect(toolNames).toEqual(expectedNames);

    for (const tool of MCP_TOOLS) {
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.properties).toBeDefined();
    }

    // Over-the-wire route check
    const req = createMcpRequest({ method: 'tools/list' });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.tools.length).toBe(8);
  });

  it('missing/invalid bearer token → 401', async () => {
    // Missing Authorization header
    const noAuthReq = createMcpRequest({ method: 'tools/list' }, null);
    const noAuthRes = await POST(noAuthReq);
    expect(noAuthRes.status).toBe(401);
    const noAuthJson = await noAuthRes.json();
    expect(noAuthJson.ok).toBe(false);
    expect(noAuthJson.error).toBe('unauthorized');

    // Invalid token
    const badAuthReq = createMcpRequest({ method: 'tools/list' }, 'wrong-invalid-token');
    const badAuthRes = await POST(badAuthReq);
    expect(badAuthRes.status).toBe(401);
    const badAuthJson = await badAuthRes.json();
    expect(badAuthJson.ok).toBe(false);
    expect(badAuthJson.error).toBe('unauthorized');

    // GET endpoint also protected
    const getReq = new NextRequest('http://localhost:3000/api/mcp');
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(401);
  });

  it('rate limit → 429 after 61 rapid requests', async () => {
    resetMcpRateLimits();

    // Fire 60 valid requests (allowed)
    for (let i = 0; i < 60; i++) {
      const req = createMcpRequest({ method: 'store_stats' });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 61st request must trigger 429
    const limitedReq = createMcpRequest({ method: 'store_stats' });
    const limitedRes = await POST(limitedReq);
    expect(limitedRes.status).toBe(429);

    const json = await limitedRes.json();
    expect(json.ok).toBe(false);
    expect(json.error).toContain('rate limit');
  });

  it('add_product with http:// (not https) URL → ok:false, nothing written', async () => {
    const countBefore = catalogRepository.getProducts().length;

    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'add_product',
        arguments: {
          title: 'Insecure Audio Gear',
          description: 'High end headphones tested for editorial review.',
          category: 'Smart Audio & Microphones',
          merchant: 'Amazon',
          affiliate_url: 'http://insecure-amazon.com/dp/12345' // INSECURE HTTP
        }
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(false);
    expect(json.error).toContain('https://');

    // Verify nothing written to repository
    const countAfter = catalogRepository.getProducts().length;
    expect(countAfter).toBe(countBefore);
  });

  it('add_product valid → product exists as "draft" in repository', async () => {
    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'add_product',
        arguments: {
          title: 'Ergonomic Vertical Mouse Pro',
          description: 'Neutral wrist angle mouse tested for tendon strain reduction.',
          category: 'Ergonomics & Peripherals',
          merchant: 'Amazon',
          affiliate_url: 'https://www.amazon.com/dp/B00PROMOUSE?tag=everyagedigital-20',
          price_min: 79.99,
          currency: 'USD'
        }
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.data.id).toBeDefined();
    expect(json.data.slug).toBe('ergonomic-vertical-mouse-pro');
    expect(json.data.status).toBe('draft');

    // Check repository state directly
    const stored = await catalogRepository.getProductById(json.data.id);
    expect(stored).toBeDefined();
    expect(stored?.name).toBe('Ergonomic Vertical Mouse Pro');
    expect(stored?.status).toBe('draft'); // Mandatory rule: always draft initially
  });

  it('set_product_status("active") → product appears in storefront queries', async () => {
    // 1. Add as draft
    const addReq = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'add_product',
        arguments: {
          title: 'Focus Noise Masking Earbuds',
          description: 'Dedicated passive noise isolation earbuds for deep productivity sessions.',
          category: 'Smart Audio & Microphones',
          merchant: 'Direct Brand',
          affiliate_url: 'https://brand.com/earbuds?ref=everyage',
          price_min: 120.00
        }
      }
    });
    const addRes = await POST(addReq);
    const addJson = await addRes.json();
    const productId = addJson.data.id;

    // As draft, it should NOT appear in storefront queries
    let storefrontSearch = searchCatalog({ query: 'Focus Noise Masking Earbuds' });
    let found = storefrontSearch.items.some(i => i.product.id === productId);
    expect(found).toBe(false);

    // 2. Set status to "active"
    const statusReq = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'set_product_status',
        arguments: {
          id: productId,
          status: 'active'
        }
      }
    });
    const statusRes = await POST(statusReq);
    const statusJson = await statusRes.json();
    expect(statusJson.ok).toBe(true);
    expect(statusJson.data.status).toBe('active');

    // 3. Now it appears in storefront search queries!
    storefrontSearch = searchCatalog({ query: 'Focus Noise Masking Earbuds' });
    found = storefrontSearch.items.some(i => i.product.id === productId);
    expect(found).toBe(true);
  });

  it('get_clicks shape matches /admin dashboard expectations', async () => {
    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'get_clicks',
        arguments: { days: 7 }
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(typeof json.data.total_clicks).toBe('number');
    expect(Array.isArray(json.data.clicks_by_day)).toBe(true);
    expect(Array.isArray(json.data.top_products)).toBe(true);

    if (json.data.clicks_by_day.length > 0) {
      expect(json.data.clicks_by_day[0]).toHaveProperty('date');
      expect(json.data.clicks_by_day[0]).toHaveProperty('count');
    }

    if (json.data.top_products.length > 0) {
      expect(json.data.top_products[0]).toHaveProperty('title');
      expect(json.data.top_products[0]).toHaveProperty('clicks');
    }
  });

  it('mark_price_checked updates lastCheckedAt', async () => {
    const products = catalogRepository.getProducts();
    const target = products[0];

    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'mark_price_checked',
        arguments: { product_id: target.id }
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.data.product_id).toBe(target.id);
    expect(json.data.lastCheckedAt).toBeDefined();

    // Verify in repository
    const offer = catalogRepository.getOfferForProduct(target.id);
    expect(offer?.lastCheckedAt).toBe(json.data.lastCheckedAt);
  });

  it('get_stale_prices only lists products past staleAfter', async () => {
    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'get_stale_prices',
        arguments: {}
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);

    const now = Date.now();
    for (const item of json.data) {
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('lastCheckedAt');
      expect(item).toHaveProperty('staleAfter');

      const checkedTime = new Date(item.lastCheckedAt).getTime();
      const staleDuration = item.staleAfter * 24 * 60 * 60 * 1000;
      expect(now - checkedTime).toBeGreaterThan(staleDuration);
    }
  });

  it('store_stats returns count only and never reveals conversation text', async () => {
    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'store_stats',
        arguments: {}
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.data.products_by_status).toBeDefined();
    expect(json.data.products_by_status.active).toBeGreaterThanOrEqual(0);
    expect(typeof json.data.clicks_7d).toBe('number');
    expect(typeof json.data.clicks_30d).toBe('number');
    expect(typeof json.data.assistant_conversations_7d).toBe('number');

    // Ensure NO conversation text or questions are exposed
    const serialized = JSON.stringify(json.data);
    expect(serialized).not.toContain('userMessage');
    expect(serialized).not.toContain('assistantReply');
  });

  it('sanitizeErrorMessage strips tokens and credentials from errors', () => {
    const dirtyError = 'Failed: Bearer sk-ant-12345abcdef with token="ghp_99999999"';
    const sanitized = sanitizeErrorMessage(dirtyError);

    expect(sanitized).not.toContain('sk-ant-12345abcdef');
    expect(sanitized).not.toContain('ghp_99999999');
    expect(sanitized).toContain('[REDACTED]');
  });
});
