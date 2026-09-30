import { describe, it, expect } from 'vitest';
import { getDeals, getDealsAsync, isQualifyingDeal } from '../src/lib/search/catalogSearch';
import { catalogRepository } from '../src/lib/db/repository';

describe('Deals Hub & Student Perks Logic', () => {
  it('excludes full-price items like the $99.99 Logitech MX Master 3S from deals query', async () => {
    const deals = await getDealsAsync();
    const slugs = deals.map(d => d.product.slug);

    // MX Master 3S has no markdown or only minor discount (< 50%) and is not a deal
    expect(slugs).not.toContain('logitech-mx-master-3s-ergonomic-mouse');
    expect(slugs).not.toContain('logitech-mx-master-3s');

    // BenQ ScreenBar Plus (if not marked is_deal or >= 50%) should not be in unless >= 50%
    for (const d of deals) {
      const isFree = Boolean(d.product.is_free || d.product.isFree);
      const isDeal = Boolean(d.product.is_deal || d.product.isDeal);
      const discount = d.product.discount_percent ?? d.product.discountPercent ?? 0;
      expect(isDeal || isFree || discount >= 50).toBe(true);
    }
  });

  it('includes Google AI Plus for Students with 100% discount and free perk status', async () => {
    const deals = await getDealsAsync();
    const googleDeal = deals.find(d => d.product.slug === 'google-ai-plus-students-free-handshake');

    expect(googleDeal).toBeDefined();
    expect(googleDeal?.product.is_free || googleDeal?.product.isFree).toBe(true);
    expect(googleDeal?.product.discount_percent ?? googleDeal?.product.discountPercent).toBe(100);
    expect(googleDeal?.product.price).toBe(0);
  });

  it('correctly filters for 100% Free & Student Perks', async () => {
    const freeDeals = await getDealsAsync('free');
    expect(freeDeals.length).toBeGreaterThan(0);

    for (const item of freeDeals) {
      const isFree = Boolean(item.product.is_free || item.product.isFree || item.offer?.price === 0 || item.product.price === 0);
      expect(isFree).toBe(true);
    }

    const slugs = freeDeals.map(d => d.product.slug);
    expect(slugs).toContain('google-ai-plus-students-free-handshake');
  });

  it('correctly filters for 80%+ Steals', async () => {
    const steals = await getDealsAsync('steals');
    expect(steals.length).toBeGreaterThan(0);

    for (const item of steals) {
      const isFree = Boolean(item.product.is_free || item.product.isFree || item.offer?.price === 0);
      const discount = item.product.discount_percent ?? item.product.discountPercent ?? 0;
      expect(isFree || discount >= 80).toBe(true);
    }
  });

  it('correctly validates deals with isQualifyingDeal logic', () => {
    const mockFreeItem: any = {
      product: {
        id: 'test-free',
        name: 'Free Perk',
        is_free: true,
        is_deal: true,
        price: 0,
        original_price: 100
      }
    };
    expect(isQualifyingDeal(mockFreeItem)).toBe(true);

    const mockFullPriceItem: any = {
      product: {
        id: 'test-full',
        name: 'Full Price Item',
        is_deal: false,
        is_free: false,
        price: 99.99,
        original_price: 109.99
      },
      offer: {
        price: 99.99,
        originalPrice: 109.99
      }
    };
    expect(isQualifyingDeal(mockFullPriceItem)).toBe(false);

    const mockDeepDiscountItem: any = {
      product: {
        id: 'test-deep',
        name: 'Deep Discount',
        is_deal: false,
        is_free: false,
        price: 15,
        original_price: 100,
        discount_percent: 85
      }
    };
    expect(isQualifyingDeal(mockDeepDiscountItem)).toBe(true);
  });
});
