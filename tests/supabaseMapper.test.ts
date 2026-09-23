import { describe, it, expect } from 'vitest';
import { 
  mapSupabaseRowToProduct, 
  mapProductInputToSupabaseRow, 
  mapProductUpdateToSupabaseRow 
} from '../src/lib/db/supabaseMapper';

describe('Supabase Product Row Mapper', () => {
  it('correctly maps a Supabase database row to the frontend Product model', () => {
    const row = {
      id: 'prod-test-123',
      slug: 'test-supabase-product',
      title: 'Supabase Verified Product',
      description: 'A product stored in Supabase PostgreSQL.',
      brand: 'Supabase Brand',
      category_id: 'Electronics',
      merchant_id: 'Amazon',
      price_min: 99.99,
      price_max: 129.99,
      currency: 'USD',
      image_url: 'https://example.com/image.jpg',
      status: 'active',
      is_owned: false,
      editorial_badge: 'Editor’s Choice',
      best_for: 'Developers seeking reliability',
      not_for: 'Users looking for quick hacks',
      features: ['Real-time sync', 'PostgreSQL powered'],
      limitations: ['Requires API key'],
      created_at: '2026-09-23T10:00:00.000Z',
      updated_at: '2026-09-23T10:00:00.000Z'
    };

    const product = mapSupabaseRowToProduct(row);

    expect(product.id).toBe('prod-test-123');
    expect(product.slug).toBe('test-supabase-product');
    expect(product.name).toBe('Supabase Verified Product');
    expect(product.brand).toBe('Supabase Brand');
    expect(product.description).toBe('A product stored in Supabase PostgreSQL.');
    expect(product.productType).toBe('physical');
    expect(product.status).toBe('active');
    expect(product.editorialBadge).toBe('Editor’s Choice');
    expect(product.features).toEqual(['Real-time sync', 'PostgreSQL powered']);
    expect(product.limitations).toEqual(['Requires API key']);
  });

  it('safely handles missing or null fields from database row', () => {
    const minimalRow = {
      id: 'prod-min',
      slug: 'min-prod',
      title: 'Minimal Product',
      description: 'Minimal description'
    };

    const product = mapSupabaseRowToProduct(minimalRow);

    expect(product.id).toBe('prod-min');
    expect(product.name).toBe('Minimal Product');
    expect(product.brand).toBe('EveryAge Curated');
    expect(product.status).toBe('draft');
    expect(Array.isArray(product.features)).toBe(true);
    expect(Array.isArray(product.limitations)).toBe(true);
    expect(product.imageUrl).toBeTruthy();
  });

  it('maps ProductInput to Supabase insert payload safely', () => {
    const input = {
      title: 'New Wireless Keyboard',
      slug: 'new-wireless-keyboard',
      description: 'Low profile ergonomic keys',
      categoryId: 'cat-1',
      merchantId: 'Amazon',
      priceMin: 79.99,
      priceMax: 99.99,
      currency: 'USD',
      imageUrl: 'https://example.com/keyboard.jpg',
      status: 'active' as const,
      isOwned: false,
      affiliateUrl: 'https://amazon.com/dp/B00123'
    };

    const payload = mapProductInputToSupabaseRow(input, 'prod-new-1');

    expect(payload.id).toBe('prod-new-1');
    expect(payload.title).toBe('New Wireless Keyboard');
    expect(payload.slug).toBe('new-wireless-keyboard');
    expect(payload.price_min).toBe(79.99);
    expect(payload.category_id).toBeNull(); // foreign key safety
    expect(payload.merchant_id).toBeNull();
  });

  it('maps Partial<ProductInput> to Supabase update payload', () => {
    const update = {
      title: 'Updated Title',
      priceMin: 89.00
    };

    const payload = mapProductUpdateToSupabaseRow(update);

    expect(payload.title).toBe('Updated Title');
    expect(payload.price_min).toBe(89.00);
    expect(payload.updated_at).toBeDefined();
    expect(payload.description).toBeUndefined();
  });
});
