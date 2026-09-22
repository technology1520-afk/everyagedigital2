import { 
  Product, 
  MerchantOffer, 
  OwnedProduct, 
  Collection, 
  Book, 
  FilterParams, 
  SourceEvidence 
} from '../../types';
import { 
  OWNED_PRODUCTS, 
  COLLECTIONS, 
  BOOKS, 
  SOURCE_EVIDENCES 
} from '../../data/seedCatalog';
import { catalogRepository } from '../db/repository';
import { getAffiliateAdapter, FreshnessResult } from '../affiliate/adapters';

export interface EnrichedProduct {
  product: Product;
  offer?: MerchantOffer;
  freshness?: FreshnessResult;
}

export interface SearchResult {
  items: EnrichedProduct[];
  total: number;
  availableCategories: string[];
  availableMerchants: string[];
  categoryCounts?: Record<string, number>;
  typeCounts?: Record<string, number>;
  merchantCounts?: Record<string, number>;
  priceRange: { min: number; max: number };
}

export function getOfferForProduct(productId: string): MerchantOffer | undefined {
  return catalogRepository.getOfferForProduct(productId);
}

export function enrichProduct(product: Product): EnrichedProduct {
  const offer = getOfferForProduct(product.id);
  let freshness: FreshnessResult | undefined = undefined;

  if (offer) {
    const adapter = getAffiliateAdapter(offer.providerName || offer.merchantName);
    freshness = adapter.checkFreshness(offer.lastCheckedAt, offer.staleAfterDays);
  }

  return { product, offer, freshness };
}

export function searchCatalog(params: FilterParams = {}): SearchResult {
  const allActive = catalogRepository.getProducts({ status: 'active' });
  let filtered = [...allActive];

  // 1. Text Query Search
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    filtered = filtered.filter(p => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = (p.brand || '').toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subcategory.toLowerCase().includes(q);
      const matchCases = p.useCases.some(u => u.toLowerCase().includes(q));
      const matchBest = (p.bestFor || '').toLowerCase().includes(q);
      return matchName || matchBrand || matchDesc || matchCat || matchSub || matchCases || matchBest;
    });
  }

  // 2. Category Filter
  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
  }

  // 3. Subcategory Filter
  if (params.subcategory) {
    filtered = filtered.filter(p => p.subcategory.toLowerCase() === params.subcategory!.toLowerCase());
  }

  // 4. Product Type Filter
  if (params.productType && params.productType !== 'all') {
    filtered = filtered.filter(p => p.productType === params.productType);
  }

  // 5. Merchant Filter
  if (params.merchant && params.merchant !== 'all') {
    filtered = filtered.filter(p => {
      const offer = getOfferForProduct(p.id);
      return offer && offer.merchantName.toLowerCase() === params.merchant!.toLowerCase();
    });
  }

  // 6. Editorial Pick Filter
  if (params.editorialPickOnly) {
    filtered = filtered.filter(p => Boolean(p.editorialBadge));
  }

  // 7. Sponsored Filter
  if (params.sponsoredOnly) {
    filtered = filtered.filter(p => Boolean(p.isSponsored));
  }

  // Enrich products with offers & freshness
  let enriched = filtered.map(enrichProduct);

  // 8. Price Range Filter
  if (params.minPrice !== undefined) {
    enriched = enriched.filter(item => item.offer && item.offer.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    enriched = enriched.filter(item => item.offer && item.offer.price <= params.maxPrice!);
  }

  // 9. Sorting (strictly by relevance, price, or editorial, NEVER by commission rate)
  const sortBy = params.sortBy || 'editorial_picks';
  switch (sortBy) {
    case 'price_low_high':
      enriched.sort((a, b) => (a.offer?.price ?? Infinity) - (b.offer?.price ?? Infinity));
      break;
    case 'price_high_low':
      enriched.sort((a, b) => (b.offer?.price ?? -1) - (a.offer?.price ?? -1));
      break;
    case 'editorial_picks':
      enriched.sort((a, b) => {
        const aBadge = a.product.editorialBadge ? 1 : 0;
        const bBadge = b.product.editorialBadge ? 1 : 0;
        if (bBadge !== aBadge) return bBadge - aBadge;
        return (a.offer?.price ?? 0) - (b.offer?.price ?? 0);
      });
      break;
    case 'newest_review':
      enriched.sort((a, b) => new Date(b.product.updatedAt).getTime() - new Date(a.product.updatedAt).getTime());
      break;
    case 'recently_added':
      enriched.sort((a, b) => new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime());
      break;
    case 'relevance':
    default:
      break;
  }

  const allCategories = Array.from(new Set(allActive.map(p => p.category)));
  const allOffers = catalogRepository.getOffers();
  const allMerchants = Array.from(new Set(allOffers.map(o => o.merchantName)));
  const allPrices = allOffers.map(o => o.price);
  const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length ? Math.max(...allPrices) : 500;

  const categoryCounts: Record<string, number> = {};
  for (const p of allActive) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }

  const typeCounts: Record<string, number> = {
    physical: 0,
    digital: 0,
    pdf_guide: 0
  };
  for (const p of allActive) {
    typeCounts[p.productType] = (typeCounts[p.productType] || 0) + 1;
  }

  const merchantCounts: Record<string, number> = {};
  for (const p of allActive) {
    const offer = getOfferForProduct(p.id);
    if (offer) {
      merchantCounts[offer.merchantName] = (merchantCounts[offer.merchantName] || 0) + 1;
    }
  }

  return {
    items: enriched,
    total: enriched.length,
    availableCategories: allCategories,
    availableMerchants: allMerchants,
    categoryCounts,
    typeCounts,
    merchantCounts,
    priceRange: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) }
  };
}

export function getProductBySlug(slug: string): EnrichedProduct | undefined {
  const product = catalogRepository.getProductBySlug(slug);
  if (!product) return undefined;
  return enrichProduct(product);
}

export function getProductById(id: string): EnrichedProduct | undefined {
  const product = catalogRepository.getProductById(id);
  if (!product) return undefined;
  return enrichProduct(product);
}

export function getSourceEvidenceForProduct(productId: string): SourceEvidence[] {
  return SOURCE_EVIDENCES.filter(s => s.productId === productId);
}

export function getAllCategories(): { name: string; count: number; slug: string }[] {
  const products = catalogRepository.getProducts({ status: 'active' });
  const counts: Record<string, number> = {};
  for (const p of products) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    slug: name.toLowerCase().replace(/\s+/g, '-')
  }));
}

export function getAllMerchants(): { name: string; count: number; slug: string }[] {
  const offers = catalogRepository.getOffers();
  const counts: Record<string, number> = {};
  for (const o of offers) {
    counts[o.merchantName] = (counts[o.merchantName] || 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    slug: name.toLowerCase().replace(/\s+/g, '-')
  }));
}

export function getDeals(): EnrichedProduct[] {
  return catalogRepository.getProducts({ status: 'active' })
    .map(enrichProduct)
    .filter(item => {
      if (!item.offer) return false;
      const hasDiscount = item.offer.originalPrice && item.offer.originalPrice > item.offer.price;
      const isBestValue = item.product.editorialBadge === 'Best Value';
      return hasDiscount || isBestValue;
    });
}

export function getAllCollections(): Collection[] {
  return COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find(c => c.slug === slug);
}

export function getAllBooks(): Book[] {
  return BOOKS;
}

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find(b => b.slug === slug);
}

export function getAllOwnedProducts(): OwnedProduct[] {
  return OWNED_PRODUCTS;
}

export function getOwnedProductBySlug(slug: string): OwnedProduct | undefined {
  return OWNED_PRODUCTS.find(p => p.slug === slug);
}
