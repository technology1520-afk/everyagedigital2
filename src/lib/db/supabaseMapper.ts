import { Product, MerchantOffer, MerchantName } from '../../types';
import { ProductInput } from './schema';

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3';
export const DEFAULT_FALLBACK_AFFILIATE_URL = 'https://www.amazon.com?tag=everyagedigital-20';

/**
 * Validates and safely normalizes any URL.
 * Prevents TypeError crashes from `new URL(...)` across storefront components and affiliate adapters.
 */
export function sanitizeValidUrl(url?: string | null, fallback?: string | null): string | null {
  if (!url || typeof url !== 'string') return fallback || null;
  const trimmed = url.trim();
  if (
    !trimmed || 
    trimmed.toLowerCase() === 'placeholder' || 
    trimmed.toLowerCase() === 'undefined' ||
    trimmed.toLowerCase() === 'null' ||
    trimmed.startsWith('PASTE_YOUR_')
  ) {
    return fallback || null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return fallback || null;
  } catch {
    return fallback || null;
  }
}

/**
 * Safely sanitizes affiliate outbound URLs, guaranteeing a valid parsable URL.
 */
export function sanitizeAffiliateUrl(url?: string | null): string {
  return sanitizeValidUrl(url, DEFAULT_FALLBACK_AFFILIATE_URL) || DEFAULT_FALLBACK_AFFILIATE_URL;
}

/**
 * Validates and converts price values into positive finite numbers or null/fallback.
 * Prevents NaN, negative numbers, or invalid string errors.
 */
export function sanitizePriceBound(val?: number | string | null, fallback: number | null = null): number | null {
  if (val === undefined || val === null || val === '') return fallback;
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || num < 0 || !isFinite(num)) return fallback;
  return Math.round(num * 100) / 100;
}

export interface SupabaseProductRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  brand?: string | null;
  category_id?: string | null;
  merchant_id?: string | null;
  price_min?: number | string | null;
  price_max?: number | string | null;
  currency?: string | null;
  image_url?: string | null;
  affiliate_url?: string | null;
  affiliate_links?: Array<{ url: string; network?: string }> | null;
  status?: string | null;
  is_owned?: boolean | null;
  rating_display?: number | string | null;
  editorial_badge?: string | null;
  best_for?: string | null;
  not_for?: string | null;
  features?: unknown;
  limitations?: unknown;
  badges?: string[] | null;
  editorial_stance?: string | null;
  tested_in_house?: boolean | null;
  last_price_checked_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Maps a row from the Supabase 'products' table to the frontend Product interface.
 * Safely normalizes null/undefined values to prevent UI crashes.
 */
export function mapSupabaseRowToProduct(row: SupabaseProductRow): Product {
  const isOwned = Boolean(row.is_owned);

  const features = Array.isArray(row.features)
    ? row.features.map(f => String(f))
    : typeof row.features === 'string'
      ? [row.features]
      : [];

  const limitations = Array.isArray(row.limitations)
    ? row.limitations.map(l => String(l))
    : typeof row.limitations === 'string'
      ? [row.limitations]
      : (row.not_for ? [row.not_for] : []);

  let status: Product['status'] = 'draft';
  if (row.status === 'active' || row.status === 'archived' || row.status === 'paused' || row.status === 'draft') {
    status = row.status;
  }

  const safeImageUrl = sanitizeValidUrl(row.image_url, DEFAULT_FALLBACK_IMAGE) || DEFAULT_FALLBACK_IMAGE;

  const isBook = 
    row.category_id === 'books-guides' ||
    row.category_id?.toLowerCase().includes('book') ||
    features.some(f => f.toLowerCase().startsWith('format:'));

  const productType: Product['productType'] = isBook ? 'book' : (isOwned ? 'digital' : 'physical');
  const category = row.category_id === 'books-guides' 
    ? 'Books & Guides' 
    : (row.category_id || 'General');
  const subcategory = isBook ? 'Curated Books' : 'General';

  return {
    id: row.id,
    slug: row.slug || `product-${row.id}`,
    name: row.title || 'Untitled Product',
    brand: row.brand?.trim() || (isBook ? 'EveryAge Editorial' : 'EveryAge Curated'),
    description: row.description || '',
    productType,
    category,
    subcategory,
    useCases: isBook ? ['Deep focus', 'Commercial wisdom', 'Daily habit design'] : ['Daily productivity', 'Everyday utility'],
    bestFor: row.best_for?.trim() || 'Shoppers looking for reliable tested essentials.',
    notFor: row.not_for?.trim() || 'Users seeking cheap disposable alternatives.',
    features: features.length > 0 ? features : ['Editorial vetted', 'Verified merchant warranty'],
    benefits: ['High durability', 'Direct merchant fulfillment'],
    limitations: limitations.length > 0 ? limitations : ['Standard merchant shipping policies apply'],
    sourceProvider: (row.merchant_id as string) || 'merchant_direct',
    imageUrl: safeImageUrl,
    imageSource: isBook ? 'Publisher Authorized' : 'Merchant Verified',
    imageLicense: 'Official Affiliate Feed',
    altText: row.title || 'Product Image',
    region: ['Global', 'US'],
    language: 'English',
    status,
    editorialNotes: row.editorial_stance || (isBook ? 'Curated reading recommendation vetted by editorial team.' : 'Editorial team vetted product.'),
    handsOnTested: row.tested_in_house !== undefined && row.tested_in_house !== null ? Boolean(row.tested_in_house) : true,
    editorialConfidence: 'Verified',
    editorialBadge: (
      row.editorial_badge === "Editor's Choice" || row.editorial_badge === 'Editor’s Choice'
        ? 'Editor’s Choice'
        : row.editorial_badge === 'Best Value'
          ? 'Best Value'
          : row.editorial_badge === 'Top Practical Pick'
            ? 'Top Practical Pick'
            : row.editorial_badge === 'Creator Favorite'
              ? 'Creator Favorite'
              : undefined
    ),
    badges: Array.isArray(row.badges) ? row.badges.map(b => String(b)) : [],
    editorialStance: row.editorial_stance || undefined,
    editorial_stance: row.editorial_stance || undefined,
    testedInHouse: row.tested_in_house !== undefined && row.tested_in_house !== null ? Boolean(row.tested_in_house) : true,
    tested_in_house: row.tested_in_house !== undefined && row.tested_in_house !== null ? Boolean(row.tested_in_house) : true,
    lastPriceCheckedAt: row.last_price_checked_at || undefined,
    last_price_checked_at: row.last_price_checked_at || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

/**
 * Maps a Supabase 'products' table row to a MerchantOffer.
 * Guarantees numeric prices with 0 fallback to prevent NaN warnings.
 */
export function mapSupabaseRowToOffer(row: SupabaseProductRow): MerchantOffer {
  let merchantName: MerchantName = 'Direct Brand';
  const rawMerchant = (row.merchant_id as string) || '';
  const merchantLower = rawMerchant.toLowerCase();
  if (merchantLower.includes('amazon')) {
    merchantName = 'Amazon';
  } else if (merchantLower.includes('gumroad')) {
    merchantName = 'Gumroad';
  } else if (merchantLower.includes('lemon')) {
    merchantName = 'Lemon Squeezy';
  } else if (merchantLower.includes('paddle')) {
    merchantName = 'Paddle';
  } else if (merchantLower.includes('impact')) {
    merchantName = 'Impact';
  } else if (merchantLower.includes('clickbank')) {
    merchantName = 'ClickBank';
  } else if (merchantLower.includes('shareasale')) {
    merchantName = 'ShareASale';
  } else if (merchantLower.includes('cj')) {
    merchantName = 'CJ';
  } else {
    merchantName = 'Direct Brand';
  }

  const rawUrl = row.affiliate_url || row.affiliate_links?.[0]?.url;
  const safeUrl = sanitizeAffiliateUrl(rawUrl);
  const price = sanitizePriceBound(row.price_min, 0) ?? 0;
  const originalPrice = sanitizePriceBound(row.price_max, null) ?? undefined;
  const nowIso = new Date().toISOString();

  return {
    id: `off-${row.id}`,
    productId: row.id,
    merchantName,
    providerName: rawMerchant || merchantName,
    affiliateProgram: `prog-${merchantLower.includes('amazon') ? 'amazon' : merchantLower.includes('gumroad') ? 'gumroad' : 'direct'}`,
    originalUrl: safeUrl,
    affiliateUrl: safeUrl,
    currency: (row.currency || 'USD').trim().toUpperCase(),
    price,
    originalPrice,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['Global', 'US'],
    lastCheckedAt: row.updated_at || row.created_at || nowIso,
    staleAfterDays: 7,
    active: row.status === 'active'
  };
}

/**
 * Maps frontend ProductInput to a Supabase 'products' table row for insertion.
 * Sets category_id and merchant_id safely to null by default to avoid FK violations
 * when referenced tables don't yet contain the IDs.
 * Sanitizes all prices and URLs to prevent runtime crashes.
 */
export function mapProductInputToSupabaseRow(input: ProductInput, id: string): Record<string, unknown> {
  const extra = input as unknown as Record<string, unknown>;
  const features = Array.isArray(extra.features) ? extra.features : [];
  const limitations = Array.isArray(extra.limitations) 
    ? extra.limitations 
    : (input.notFor ? [input.notFor] : []);

  const safeImageUrl = sanitizeValidUrl(input.imageUrl, null);

  return {
    id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    brand: input.brand?.trim() || null,
    category_id: null,
    merchant_id: null,
    price_min: sanitizePriceBound(input.priceMin, 0) ?? 0,
    price_max: sanitizePriceBound(input.priceMax, null),
    currency: (input.currency || 'USD').trim().toUpperCase(),
    image_url: safeImageUrl,
    status: input.status || 'draft',
    is_owned: Boolean(input.isOwned),
    editorial_badge: input.editorialBadge?.trim() || null,
    best_for: input.bestFor?.trim() || null,
    not_for: input.notFor?.trim() || null,
    features,
    limitations,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Maps partial ProductInput to a Supabase 'products' table row for updates.
 * Sanitizes all prices and URLs to prevent database or parser errors.
 */
export function mapProductUpdateToSupabaseRow(input: Partial<ProductInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  const extra = input as unknown as Record<string, unknown>;

  if (input.title !== undefined) row.title = input.title;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.description !== undefined) row.description = input.description;
  if (input.brand !== undefined) row.brand = input.brand?.trim() || null;
  if (input.priceMin !== undefined) row.price_min = sanitizePriceBound(input.priceMin, 0) ?? 0;
  if (input.priceMax !== undefined) row.price_max = sanitizePriceBound(input.priceMax, null);
  if (input.currency !== undefined) row.currency = (input.currency || 'USD').trim().toUpperCase();
  if (input.imageUrl !== undefined) row.image_url = sanitizeValidUrl(input.imageUrl, null);
  if (input.status !== undefined) row.status = input.status;
  if (input.isOwned !== undefined) row.is_owned = Boolean(input.isOwned);
  if (input.editorialBadge !== undefined) row.editorial_badge = input.editorialBadge?.trim() || null;
  if (input.bestFor !== undefined) row.best_for = input.bestFor?.trim() || null;
  if (input.notFor !== undefined) row.not_for = input.notFor?.trim() || null;
  if (extra.features !== undefined) row.features = extra.features;
  if (extra.limitations !== undefined) row.limitations = extra.limitations;

  return row;
}
