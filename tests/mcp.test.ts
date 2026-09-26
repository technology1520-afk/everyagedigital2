import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { catalogRepository } from '../src/lib/db/repository';
import { searchCatalog } from '../src/lib/search/catalogSearch';
import { POST, GET } from '../src/app/api/mcp/route';
import { MCP_TOOLS } from '../src/lib/mcp/tools';
import { DEFAULT_MCP_TOKEN, resetMcpRateLimits, sanitizeErrorMessage, verifyMcpAuth } from '../src/lib/mcp/auth';

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

  it('tools/list returns exactly 12 tools with valid JSON schemas', async () => {
    // Direct MCP definition check
    expect(MCP_TOOLS.length).toBe(12);
    const expectedNames = [
      'list_products',
      'add_product',
      'update_product',
      'set_product_status',
      'get_clicks',
      'mark_price_checked',
      'get_stale_prices',
      'store_stats',
      'list_bundles',
      'create_bundle',
      'manage_bundle_products',
      'delete_bundle'
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
    expect(json.data.tools.length).toBe(12);
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
    expect(json.data.last_price_checked_at).toBeDefined();

    // Verify in repository
    const offer = catalogRepository.getOfferForProduct(target.id);
    expect(offer?.lastCheckedAt).toBe(json.data.lastCheckedAt);

    const storedProduct = await catalogRepository.getProductById(target.id);
    expect(storedProduct?.last_price_checked_at).toBe(json.data.last_price_checked_at);
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

  it('add_product defaults tested_in_house to false, initializes last_price_checked_at, and omits hands-on tested badge', async () => {
    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'add_product',
        arguments: {
          title: 'Mechanical Key Switch Tester',
          description: 'Multi-switch tester unit for tactile evaluation.',
          category: 'Ergonomics & Peripherals',
          merchant: 'Amazon',
          affiliate_url: 'https://www.amazon.com/dp/B00SWITCHTEST?tag=everyagedigital-20',
          price_min: 24.99
        }
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.data.tested_in_house).toBe(false);
    expect(json.data.last_price_checked_at).toBeDefined();
    expect(new Date(json.data.last_price_checked_at).getTime()).toBeGreaterThan(0);
    expect(json.data.badges).toEqual([]);

    const stored = await catalogRepository.getProductById(json.data.id);
    expect(stored).toBeDefined();
    expect(stored?.handsOnTested).toBe(false);
    expect(stored?.tested_in_house).toBe(false);
    expect(stored?.last_price_checked_at).toBe(json.data.last_price_checked_at);
    expect(stored?.badges?.some((b: string) => b.toLowerCase().includes('hands-on tested'))).toBe(false);
  });

  it('add_product accepts optional editorial overrides (badges, editorial_stance, tested_in_house)', async () => {
    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'add_product',
        arguments: {
          title: 'Heavy Duty Gas Spring Monitor Arm',
          description: 'Full articulation monitor arm supporting up to 35-inch screens.',
          category: 'Ergonomics & Peripherals',
          merchant: 'Amazon',
          affiliate_url: 'https://www.amazon.com/dp/B00MONITORARM?tag=everyagedigital-20',
          price_min: 89.99,
          badges: ["Editor's Choice", 'Hands-on Tested'],
          editorial_stance: 'Benchmark build quality for dual monitor productivity setups.',
          tested_in_house: true
        }
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.data.tested_in_house).toBe(true);
    expect(json.data.editorial_stance).toBe('Benchmark build quality for dual monitor productivity setups.');
    expect(json.data.badges).toEqual(["Editor's Choice", 'Hands-on Tested']);
    expect(json.data.last_price_checked_at).toBeDefined();

    const stored = await catalogRepository.getProductById(json.data.id);
    expect(stored).toBeDefined();
    expect(stored?.handsOnTested).toBe(true);
    expect(stored?.tested_in_house).toBe(true);
    expect(stored?.editorialBadge).toBe("Editor's Choice");
    expect(stored?.editorialNotes).toBe('Benchmark build quality for dual monitor productivity setups.');
    expect(stored?.badges).toContain('Hands-on Tested');
  });

  it('update_product supports updating editorial overrides (badges, editorial_stance, tested_in_house)', async () => {
    const products = catalogRepository.getProducts();
    const target = products[0];

    const req = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'update_product',
        arguments: {
          id: target.id,
          badges: ['Best Value'],
          editorial_stance: 'Revised long-term verdict after extensive daily testing.',
          tested_in_house: true
        }
      }
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.data.id).toBe(target.id);
    expect(json.data.editorialNotes).toBe('Revised long-term verdict after extensive daily testing.');
    expect(json.data.editorialBadge).toBe('Best Value');
    expect(json.data.handsOnTested).toBe(true);
    expect(json.data.badges).toEqual(['Best Value']);

    const stored = await catalogRepository.getProductById(target.id);
    expect(stored?.editorialNotes).toBe('Revised long-term verdict after extensive daily testing.');
    expect(stored?.editorialBadge).toBe('Best Value');
    expect(stored?.handsOnTested).toBe(true);
  });

  it('bundle MCP tools: create, list, manage, and delete bundles', async () => {
    // 1. List bundles initial
    const listReq1 = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'list_bundles',
        arguments: {}
      }
    });
    const listRes1 = await POST(listReq1);
    expect(listRes1.status).toBe(200);
    const listJson1 = await listRes1.json();
    expect(listJson1.ok).toBe(true);
    expect(Array.isArray(listJson1.data.bundles)).toBe(true);
    const initialBundleCount = listJson1.data.bundles.length;

    const allProducts = await catalogRepository.getAllProducts();
    const slug1 = allProducts[0]?.slug || 'prod-1';
    const slug2 = allProducts[1]?.slug || 'prod-2';
    const slug3 = allProducts[2]?.slug || 'prod-3';

    // 2. Create bundle with products
    const createReq = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'create_bundle',
        arguments: {
          title: 'Remote Deep Focus Station',
          slug: 'remote-deep-focus-station',
          description: 'A curated bundle for high productivity and focus.',
          product_slugs: [slug1, slug2]
        }
      }
    });
    const createRes = await POST(createReq);
    expect(createRes.status).toBe(200);
    const createJson = await createRes.json();
    expect(createJson.ok).toBe(true);
    expect(createJson.data.bundle).toBeDefined();
    expect(createJson.data.bundle.slug).toBe('remote-deep-focus-station');

    // 3. List bundles and verify new bundle exists
    const listReq2 = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'list_bundles',
        arguments: {}
      }
    });
    const listRes2 = await POST(listReq2);
    const listJson2 = await listRes2.json();
    expect(listJson2.data.bundles.length).toBe(initialBundleCount + 1);
    const createdBundle = listJson2.data.bundles.find((b: any) => b.slug === 'remote-deep-focus-station');
    expect(createdBundle).toBeDefined();

    // 4. Manage bundle products: add a product
    const manageAddReq = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'manage_bundle_products',
        arguments: {
          bundle_slug: 'remote-deep-focus-station',
          action: 'add',
          product_slugs: [slug3]
        }
      }
    });
    const manageAddRes = await POST(manageAddReq);
    expect(manageAddRes.status).toBe(200);
    const manageAddJson = await manageAddRes.json();
    expect(manageAddJson.ok).toBe(true);

    // 5. Manage bundle products: remove a product
    const manageRemoveReq = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'manage_bundle_products',
        arguments: {
          bundle_slug: 'remote-deep-focus-station',
          action: 'remove',
          product_slugs: [slug1]
        }
      }
    });
    const manageRemoveRes = await POST(manageRemoveReq);
    expect(manageRemoveRes.status).toBe(200);
    const manageRemoveJson = await manageRemoveRes.json();
    expect(manageRemoveJson.ok).toBe(true);

    // 6. Delete bundle
    const deleteReq = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'delete_bundle',
        arguments: {
          bundle_slug: 'remote-deep-focus-station'
        }
      }
    });
    const deleteRes = await POST(deleteReq);
    expect(deleteRes.status).toBe(200);
    const deleteJson = await deleteRes.json();
    expect(deleteJson.ok).toBe(true);

    // Verify bundle is removed
    const listReq3 = createMcpRequest({
      method: 'tools/call',
      params: {
        name: 'list_bundles',
        arguments: {}
      }
    });
    const listRes3 = await POST(listReq3);
    const listJson3 = await listRes3.json();
    const stillExists = listJson3.data.bundles.some((b: any) => b.slug === 'remote-deep-focus-station');
    expect(stillExists).toBe(false);
  });

  it('sanitizeErrorMessage strips tokens and credentials from errors', () => {
    const dirtyError = 'Failed: Bearer sk-ant-12345abcdef with token="ghp_99999999"';
    const sanitized = sanitizeErrorMessage(dirtyError);

    expect(sanitized).not.toContain('sk-ant-12345abcdef');
    expect(sanitized).not.toContain('ghp_99999999');
    expect(sanitized).toContain('[REDACTED]');
  });

  it('prohibits default fallback MCP token in production', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalToken = process.env.ADMIN_MCP_TOKEN;

    try {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.ADMIN_MCP_TOKEN;

      const result = verifyMcpAuth('Bearer test-mcp-token-2026-everyage-digital-secret');
      expect(result.authenticated).toBe(false);
      expect(result.error).toBe('unauthorized');
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalToken !== undefined) {
        process.env.ADMIN_MCP_TOKEN = originalToken;
      }
    }
  });
});
