import { describe, it, expect, beforeEach } from 'vitest';
import { catalogRepository } from '../src/lib/db/repository';
import { 
  ProductInputSchema, 
  validateAffiliateUrlForNetwork 
} from '../src/lib/db/schema';

describe('Master Prompt §13: Repository CRUD & Zod Validation', () => {
  beforeEach(() => {
    catalogRepository.reset();
  });

  it('validates product input and rejects invalid schema', () => {
    // Missing title and invalid URL
    const invalidInput = {
      title: '',
      slug: 'bad slug with spaces',
      description: 'Short',
      categoryId: 'Hardware',
      merchantId: 'Amazon',
      priceMin: -10, // negative price
      affiliateUrl: 'not-a-url',
      status: 'active' as const,
      isOwned: false
    };

    const parsed = ProductInputSchema.safeParse(invalidInput);
    expect(parsed.success).toBe(false);
  });

  it('rejects bad affiliate URLs per merchant network', () => {
    // Amazon network requires amazon.com or amzn.to
    expect(validateAffiliateUrlForNetwork('https://ebay.com/item/123', 'amazon')).toBe(false);
    expect(validateAffiliateUrlForNetwork('https://www.amazon.com/dp/B00123?tag=everyage-20', 'amazon')).toBe(true);
    expect(validateAffiliateUrlForNetwork('https://amzn.to/3X9Yz', 'amazon')).toBe(true);

    // Gumroad requires gumroad.com
    expect(validateAffiliateUrlForNetwork('https://malicious-site.com/fake', 'gumroad')).toBe(false);
    expect(validateAffiliateUrlForNetwork('https://gumroad.com/l/product-template', 'gumroad')).toBe(true);
  });

  it('enforces slug uniqueness when creating products', () => {
    const validProduct = {
      title: 'Ultra Ergonomic Split Keyboard',
      slug: 'ultra-ergonomic-split-keyboard',
      description: 'High performance split keyboard tested for RSI prevention.',
      categoryId: 'Ergonomics & Peripherals',
      merchantId: 'Amazon',
      priceMin: 149.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
      affiliateUrl: 'https://www.amazon.com/dp/B00KEYBOARD?tag=everyagedigital-20',
      status: 'active' as const,
      isOwned: false
    };

    const firstCreate = catalogRepository.createProduct(validProduct);
    expect(firstCreate.success).toBe(true);
    expect(firstCreate.product?.slug).toBe('ultra-ergonomic-split-keyboard');

    // Attempt to create duplicate slug
    const duplicateCreate = catalogRepository.createProduct(validProduct);
    expect(duplicateCreate.success).toBe(false);
    expect(duplicateCreate.error).toContain('is already taken');
  });

  it('supports full product lifecycle: create, update, toggle status, and delete', () => {
    const input = {
      title: 'Field Audio Recorder Pro',
      slug: 'field-audio-recorder-pro',
      description: '32-bit float audio recorder for documentary creators.',
      categoryId: 'Smart Audio & Microphones',
      merchantId: 'Amazon',
      priceMin: 199.00,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
      affiliateUrl: 'https://www.amazon.com/dp/B00RECORDER?tag=everyagedigital-20',
      status: 'draft' as const,
      isOwned: false
    };

    // 1. Create
    const created = catalogRepository.createProduct(input);
    expect(created.success).toBe(true);
    const id = created.product!.id;

    // 2. Update
    const updated = catalogRepository.updateProduct(id, {
      title: 'Field Audio Recorder Pro (Updated)',
      priceMin: 189.00
    });
    expect(updated.success).toBe(true);
    expect(updated.product?.name).toBe('Field Audio Recorder Pro (Updated)');

    // 3. Toggle Status to active
    const toggled = catalogRepository.toggleProductStatus(id, 'active');
    expect(toggled?.status).toBe('active');

    // 4. Delete
    const deleted = catalogRepository.deleteProduct(id);
    expect(deleted).toBe(true);
    expect(catalogRepository.getProductById(id)).toBeUndefined();
  });
});
