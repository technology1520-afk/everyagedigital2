import { describe, it, expect } from 'vitest';
import { searchCatalog, getProductBySlug, getDeals } from '../src/lib/search/catalogSearch';
import { PRODUCTS } from '../src/data/seedCatalog';

describe('Catalog Search & Filtering', () => {
  it('returns all products when no filters are specified', () => {
    const result = searchCatalog();
    expect(result.total).toBe(PRODUCTS.length);
  });

  it('retrieves specific product by slug with offer enrichment', () => {
    const product = getProductBySlug('benq-screenbar-plus-monitor-light');
    expect(product).toBeDefined();
    expect(product?.product.brand).toBe('BenQ');
    expect(product?.offer).toBeDefined();
  });

  it('filters products accurately by category', () => {
    const result = searchCatalog({ category: 'Home Office' });
    expect(result.items.length).toBeGreaterThan(0);
    for (const item of result.items) {
      expect(item.product.category).toBe('Home Office');
    }
  });

  it('filters products by merchant', () => {
    const result = searchCatalog({ merchant: 'Amazon' });
    expect(result.items.length).toBeGreaterThan(0);
    for (const item of result.items) {
      expect(item.offer?.merchantName).toBe('Amazon');
    }
  });

  it('filters digital vs physical products', () => {
    const digitalResult = searchCatalog({ productType: 'digital' });
    expect(digitalResult.items.length).toBeGreaterThan(0);
    for (const item of digitalResult.items) {
      expect(item.product.productType).toBe('digital');
    }
  });

  it('filters products by maxPrice boundary', () => {
    const result = searchCatalog({ maxPrice: 50 });
    for (const item of result.items) {
      expect(item.offer?.price).toBeLessThanOrEqual(50);
    }
  });

  it('sorts correctly by price low to high', () => {
    const result = searchCatalog({ sortBy: 'price_low_high' });
    const prices = result.items.map(i => i.offer?.price ?? 0);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it('sorts correctly by price high to low', () => {
    const result = searchCatalog({ sortBy: 'price_high_low' });
    const prices = result.items.map(i => i.offer?.price ?? 0);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  it('prioritizes editorial picks when requested', () => {
    const result = searchCatalog({ editorialPickOnly: true });
    expect(result.items.length).toBeGreaterThan(0);
    for (const item of result.items) {
      expect(item.product.editorialBadge).toBeDefined();
    }
  });

  it('handles zero-match queries gracefully with empty list', () => {
    const result = searchCatalog({ query: 'xyznonexistentterm123' });
    expect(result.items.length).toBe(0);
    expect(result.total).toBe(0);
  });

  it('returns verified deals with markdown or best value badge', () => {
    const deals = getDeals();
    expect(deals.length).toBeGreaterThan(0);
    for (const d of deals) {
      const hasDiscount = d.offer?.originalPrice && d.offer.originalPrice > d.offer.price;
      const isBestValue = d.product.editorialBadge === 'Best Value';
      expect(hasDiscount || isBestValue).toBe(true);
    }
  });
});
