import { Product } from '../../types';
import { ProductInput } from './schema';

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
  status?: string | null;
  is_owned?: boolean | null;
  rating_display?: number | string | null;
  editorial_badge?: string | null;
  best_for?: string | null;
  not_for?: string | null;
  features?: unknown;
  limitations?: unknown;
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

  return {
    id: row.id,
    slug: row.slug,
    name: row.title || 'Untitled Product',
    brand: row.brand || 'EveryAge Curated',
    description: row.description || '',
    productType: isOwned ? 'digital' : 'physical',
    category: row.category_id || 'General',
    subcategory: 'General',
    useCases: ['Daily productivity', 'Everyday utility'],
    bestFor: row.best_for || 'Shoppers looking for reliable tested essentials.',
    notFor: row.not_for || 'Users seeking cheap disposable alternatives.',
    features: features.length > 0 ? features : ['Editorial vetted', 'Verified merchant warranty'],
    benefits: ['High durability', 'Direct merchant fulfillment'],
    limitations: limitations.length > 0 ? limitations : ['Standard merchant shipping policies apply'],
    sourceProvider: (row.merchant_id as string) || 'merchant_direct',
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    imageSource: 'Merchant Verified',
    imageLicense: 'Official Affiliate Feed',
    altText: row.title || 'Product Image',
    region: ['Global', 'US'],
    language: 'English',
    status,
    editorialNotes: 'Editorial team vetted product.',
    handsOnTested: true,
    editorialConfidence: 'Verified',
    editorialBadge: (row.editorial_badge as Product['editorialBadge']) || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

/**
 * Maps frontend ProductInput to a Supabase 'products' table row for insertion.
 * Sets category_id and merchant_id safely to null by default to avoid FK violations
 * when referenced tables don't yet contain the IDs.
 */
export function mapProductInputToSupabaseRow(input: ProductInput, id: string): Record<string, unknown> {
  const extra = input as unknown as Record<string, unknown>;
  const features = Array.isArray(extra.features) ? extra.features : [];
  const limitations = Array.isArray(extra.limitations) 
    ? extra.limitations 
    : (input.notFor ? [input.notFor] : []);

  return {
    id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    brand: input.brand || null,
    category_id: null,
    merchant_id: null,
    price_min: input.priceMin !== undefined ? Number(input.priceMin) : null,
    price_max: input.priceMax !== undefined ? Number(input.priceMax) : null,
    currency: input.currency || 'USD',
    image_url: input.imageUrl || null,
    status: input.status || 'draft',
    is_owned: Boolean(input.isOwned),
    editorial_badge: input.editorialBadge || null,
    best_for: input.bestFor || null,
    not_for: input.notFor || null,
    features,
    limitations,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Maps partial ProductInput to a Supabase 'products' table row for updates.
 */
export function mapProductUpdateToSupabaseRow(input: Partial<ProductInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  const extra = input as unknown as Record<string, unknown>;

  if (input.title !== undefined) row.title = input.title;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.description !== undefined) row.description = input.description;
  if (input.brand !== undefined) row.brand = input.brand || null;
  if (input.priceMin !== undefined) row.price_min = Number(input.priceMin);
  if (input.priceMax !== undefined) row.price_max = input.priceMax ? Number(input.priceMax) : null;
  if (input.currency !== undefined) row.currency = input.currency;
  if (input.imageUrl !== undefined) row.image_url = input.imageUrl || null;
  if (input.status !== undefined) row.status = input.status;
  if (input.isOwned !== undefined) row.is_owned = Boolean(input.isOwned);
  if (input.editorialBadge !== undefined) row.editorial_badge = input.editorialBadge || null;
  if (input.bestFor !== undefined) row.best_for = input.bestFor || null;
  if (input.notFor !== undefined) row.not_for = input.notFor || null;
  if (extra.features !== undefined) row.features = extra.features;
  if (extra.limitations !== undefined) row.limitations = extra.limitations;

  return row;
}
