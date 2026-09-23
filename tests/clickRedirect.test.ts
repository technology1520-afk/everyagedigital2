import { describe, it, expect, beforeEach } from 'vitest';
import { catalogRepository } from '../src/lib/db/repository';
import { GET } from '../src/app/api/go/[id]/route';
import { NextRequest } from 'next/server';

describe('Master Prompt §10 & §13: Click Redirect Flow (/api/go/[id])', () => {
  beforeEach(() => {
    catalogRepository.reset();
  });

  it('increments click count and returns a compliant 302 redirect to merchant', async () => {
    const products = catalogRepository.getProducts();
    const targetProduct = products[0];
    const initialLinks = catalogRepository.getLinks();
    const targetLink = initialLinks.find(l => l.productId === targetProduct.id)!;
    const initialClicks = targetLink.clickCount;

    // Simulate GET request to /api/go/[id]
    const request = new NextRequest(`http://localhost:3000/api/go/${targetProduct.id}`, {
      headers: {
        'referer': 'https://google.com/search?q=everyage+digital',
        'x-vercel-ip-country': 'US'
      }
    });

    const response = await GET(request, {
      params: Promise.resolve({ id: targetProduct.id })
    });

    // 1. Must return a 302 redirect
    expect(response.status).toBe(302);

    // 2. Redirect Location header must match merchant affiliate destination
    const location = response.headers.get('location');
    expect(location).toBe(targetLink.url);

    // 3. Must increment click count by exactly 1
    const updatedLinks = catalogRepository.getLinks();
    const updatedLink = updatedLinks.find(l => l.productId === targetProduct.id)!;
    expect(updatedLink.clickCount).toBe(initialClicks + 1);

    // 4. Must set cache-control headers preventing browser from caching 302
    expect(response.headers.get('cache-control')).toContain('no-cache');
  });

  it('handles missing link gracefully by falling back to shop route', async () => {
    const request = new NextRequest('http://localhost:3000/api/go/non-existent-link-999');
    const response = await GET(request, {
      params: Promise.resolve({ id: 'non-existent-link-999' })
    });

    expect(response.status).toBe(302);
    const location = response.headers.get('location');
    expect(location).toContain('/shop');
  });

  it('rejects unsafe protocol (javascript:, data:) and falls back to safe storefront redirect', async () => {
    const rawLinks = (catalogRepository as any).links;
    const originalUrl = rawLinks[0].url;
    rawLinks[0].url = 'javascript:alert("hacked")';

    try {
      const request = new NextRequest(`http://localhost:3000/api/go/${rawLinks[0].productId}`);
      const response = await GET(request, {
        params: Promise.resolve({ id: rawLinks[0].productId })
      });

      expect(response.status).toBe(302);
      const location = response.headers.get('location');
      expect(location).toContain('/shop?utm_source=unsafe_protocol');
      expect(location).not.toContain('javascript:');
    } finally {
      rawLinks[0].url = originalUrl;
    }
  });

  it('rejects malformed URLs and falls back gracefully', async () => {
    const rawLinks = (catalogRepository as any).links;
    const originalUrl = rawLinks[0].url;
    rawLinks[0].url = 'ht!tp://:::invalid-url';

    try {
      const request = new NextRequest(`http://localhost:3000/api/go/${rawLinks[0].productId}`);
      const response = await GET(request, {
        params: Promise.resolve({ id: rawLinks[0].productId })
      });

      expect(response.status).toBe(302);
      const location = response.headers.get('location');
      expect(location).toContain('/shop?utm_source=invalid_url');
    } finally {
      rawLinks[0].url = originalUrl;
    }
  });
});
