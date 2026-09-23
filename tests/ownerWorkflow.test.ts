import { describe, it, expect, beforeEach } from 'vitest';
import { catalogRepository } from '../src/lib/db/repository';
import { searchCatalog } from '../src/lib/search/catalogSearch';
import { ProductInput } from '../src/lib/db/schema';

describe('Master Prompt §4 & §13: Owner End-to-End 2-Minute Workflow', () => {
  beforeEach(() => {
    catalogRepository.reset();
  });

  it('completes the entire owner workflow: add product → live in shop → record click → dashboard stats updated', async () => {
    // Step 1 & 2: Fill out product fields in Admin
    const newProductPayload: ProductInput = {
      title: 'Sony WH-1000XM5 Noise Canceling Headphones (Silver)',
      slug: 'sony-wh-1000xm5-silver',
      description: 'Industry-leading noise cancelation with two processors and 8 microphones for quiet focused work.',
      categoryId: 'Smart Audio & Microphones',
      merchantId: 'Amazon',
      priceMin: 398.00,
      priceMax: 449.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      affiliateUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=everyagedigital-20',
      status: 'active',
      isOwned: false,
      bestFor: 'Commuters, remote engineers, and open-plan desk workers needing silence.',
      notFor: 'Gym workouts with heavy sweat or compact pocket portability.',
      editorialBadge: "Editor's Choice"
    };

    // Step 3: Save as Active
    const createResult = await catalogRepository.createProduct(newProductPayload);
    expect(createResult.success).toBe(true);
    const createdProduct = createResult.product!;
    expect(createdProduct.status).toBe('active');

    // 3b. Verify product appears immediately on /shop and search
    const shopSearchResults = searchCatalog({
      query: 'Sony WH-1000XM5',
      category: 'Smart Audio & Microphones'
    });

    const foundInShop = shopSearchResults.items.some(
      item => item.product.slug === 'sony-wh-1000xm5-silver'
    );
    expect(foundInShop).toBe(true);

    // Step 4: User on storefront clicks the affiliate link (/api/go/[id])
    const initialStats = catalogRepository.getDashboardStats();
    const initialClicks = initialStats.clicksLast7d;

    const redirectTarget = catalogRepository.recordClick(
      createdProduct.id,
      'https://everyagedigital.com/shop',
      'US'
    );

    expect(redirectTarget).toBe('https://www.amazon.com/dp/B09XS7JWHH?tag=everyagedigital-20');

    // 4b. Verify click_count +1 and visible on /admin dashboard
    const updatedStats = catalogRepository.getDashboardStats();
    expect(updatedStats.clicksLast7d).toBe(initialClicks + 1);

    const productInStats = updatedStats.topProducts.find(p => p.id === createdProduct.id);
    expect(productInStats).toBeDefined();
    expect(productInStats?.clicks).toBe(1);
  });
});
