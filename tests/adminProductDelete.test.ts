import { describe, it, expect, beforeEach } from 'vitest';
import { catalogRepository } from '../src/lib/db/repository';
import { ProductInput } from '../src/lib/db/schema';
import { createSessionToken, DEFAULT_ADMIN_EMAIL, ADMIN_COOKIE_NAME } from '../src/lib/auth/adminAuth';

describe('Admin Product Delete & Archive Workflow', () => {
  beforeEach(() => {
    catalogRepository.reset();
  });

  it('allows owner to archive product, updating its status to archived', async () => {
    // 1. Create a test product
    const input: ProductInput = {
      title: 'Product to Archive Test',
      slug: 'product-to-archive-test',
      description: 'Testing product archive confirmation action',
      categoryId: 'Desk Setup & Lighting',
      merchantId: 'Amazon',
      priceMin: 49.99,
      currency: 'USD',
      imageUrl: 'https://example.com/item.jpg',
      affiliateUrl: 'https://amazon.com/dp/B000TEST1',
      status: 'active',
      isOwned: false
    };

    const created = await catalogRepository.createProduct(input);
    expect(created.success).toBe(true);
    const prodId = created.product!.id;

    // 2. Toggle status to archived
    const archived = await catalogRepository.toggleProductStatus(prodId, 'archived');
    expect(archived).toBeDefined();
    expect(archived?.status).toBe('archived');

    // 3. Verify in repository
    const fetched = catalogRepository.getProductByIdSync(prodId);
    expect(fetched?.status).toBe('archived');
  });

  it('allows owner to permanently delete product, removing product and associated links', async () => {
    // 1. Create a test product
    const input: ProductInput = {
      title: 'Product to Delete Test',
      slug: 'product-to-delete-test',
      description: 'Testing product delete confirmation action',
      categoryId: 'Ergonomics & Movement',
      merchantId: 'Amazon',
      priceMin: 89.99,
      currency: 'USD',
      imageUrl: 'https://example.com/item2.jpg',
      affiliateUrl: 'https://amazon.com/dp/B000TEST2',
      status: 'active',
      isOwned: false
    };

    const created = await catalogRepository.createProduct(input);
    expect(created.success).toBe(true);
    const prodId = created.product!.id;

    // Verify it exists in offers & links
    expect(catalogRepository.getOffers().some(o => o.productId === prodId)).toBe(true);
    expect(catalogRepository.getLinks().some(l => l.productId === prodId)).toBe(true);

    // 2. Delete product
    const deleted = await catalogRepository.deleteProduct(prodId);
    expect(deleted).toBe(true);

    // 3. Verify product, offers, and links are cleanly removed
    expect(catalogRepository.getProductByIdSync(prodId)).toBeUndefined();
    expect(catalogRepository.getOffers().some(o => o.productId === prodId)).toBe(false);
    expect(catalogRepository.getLinks().some(l => l.productId === prodId)).toBe(false);

    // 4. Repeated delete returns false
    const secondDelete = await catalogRepository.deleteProduct(prodId);
    expect(secondDelete).toBe(false);
  });

  it('successfully deletes products with foreign key relations (clicks & affiliate links)', async () => {
    const input: ProductInput = {
      title: 'Product With Clicks Test',
      slug: 'product-with-clicks-test',
      description: 'Testing cascading delete when clicks exist',
      categoryId: 'Desk Setup & Lighting',
      merchantId: 'Amazon',
      priceMin: 29.99,
      currency: 'USD',
      imageUrl: 'https://example.com/item3.jpg',
      affiliateUrl: 'https://amazon.com/dp/B000TEST3',
      status: 'active',
      isOwned: false
    };

    const created = await catalogRepository.createProduct(input);
    expect(created.success).toBe(true);
    const prodId = created.product!.id;

    // Simulate clicks recorded for this product
    catalogRepository.recordClick(prodId, 'https://google.com', 'US');
    catalogRepository.recordClick(prodId, 'Direct', 'CA');

    // Deleting product must succeed and cleanly remove/cascade
    const deleted = await catalogRepository.deleteProduct(prodId);
    expect(deleted).toBe(true);

    expect(catalogRepository.getProductByIdSync(prodId)).toBeUndefined();
    expect(catalogRepository.getOffers().some(o => o.productId === prodId)).toBe(false);
    expect(catalogRepository.getLinks().some(l => l.productId === prodId)).toBe(false);
  });
});
