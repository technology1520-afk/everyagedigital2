import { catalogRepository } from '../db/repository';
import { 
  ListProductsInputSchema, 
  AddProductInputSchema, 
  UpdateProductInputSchema, 
  SetProductStatusInputSchema, 
  GetClicksInputSchema, 
  MarkPriceCheckedInputSchema, 
  GetStalePricesInputSchema, 
  StoreStatsInputSchema 
} from './schema';
import { sanitizeErrorMessage } from './auth';
import { Product } from '../../types';

export type McpToolResponse<T = unknown> = 
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * 1. list_products
 * Returns filtered products: { id, slug, title, category, merchant, price_min, price_max, currency, status, clicks }
 */
export async function handleListProducts(args: unknown): Promise<McpToolResponse> {
  const parsed = ListProductsInputSchema.safeParse(args || {});
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const products = catalogRepository.getProductsForMcp(parsed.data);
  return { ok: true, data: products };
}

/**
 * 2. add_product
 * Creates product strictly with status 'draft'. Enforces https URL and slug uniqueness.
 * Defaults tested_in_house to false and omits "hands-on tested" badges unless explicitly specified.
 * Automatically initializes last_price_checked_at timestamp.
 */
export async function handleAddProduct(args: unknown): Promise<McpToolResponse> {
  const parsed = AddProductInputSchema.safeParse(args);
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const data = parsed.data;
  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const nowIso = new Date().toISOString();

  // 1. tested_in_house: defaults to false unless explicitly true
  const testedInHouse = data.tested_in_house === true;

  // 2. badges: omit "hands-on tested" badges unless explicitly specified in badges array
  let badges: string[] = [];
  if (Array.isArray(data.badges)) {
    badges = [...data.badges];
  }

  // Derive editorialBadge if one matches standard editorial badges
  let editorialBadge: Product['editorialBadge'] = undefined;
  if (badges.length > 0) {
    const foundBadge = badges.find(b => 
      b === "Editor's Choice" || b === "Editor’s Choice" || b === "Best Value" || b === "Top Practical Pick" || b === "Creator Favorite"
    );
    if (foundBadge) {
      editorialBadge = foundBadge as Product['editorialBadge'];
    }
  }

  // add_product ALWAYS creates as "draft" — human owner activates in /admin
  const result = await catalogRepository.createProduct({
    title: data.title,
    slug,
    description: data.description,
    categoryId: data.category,
    merchantId: data.merchant,
    affiliateUrl: data.affiliate_url,
    priceMin: data.price_min,
    priceMax: data.price_max,
    currency: data.currency || 'USD',
    imageUrl: data.image_url,
    status: 'draft',
    isOwned: false,
    editorialBadge,
    editorialNotes: data.editorial_stance || 'Added via EveryAge Digital admin control center.',
    editorialStance: data.editorial_stance,
    editorial_stance: data.editorial_stance,
    testedInHouse,
    tested_in_house: testedInHouse,
    badges,
    lastPriceCheckedAt: nowIso,
    last_price_checked_at: nowIso
  } as any);

  if (!result.success || !result.product) {
    return { ok: false, error: sanitizeErrorMessage(result.error || 'Failed to create product') };
  }

  return {
    ok: true,
    data: {
      id: result.product.id,
      slug: result.product.slug,
      status: result.product.status,
      tested_in_house: testedInHouse,
      badges,
      editorial_stance: data.editorial_stance,
      last_price_checked_at: nowIso
    }
  };
}

/**
 * 3. update_product
 * Partial update, Zod-validated, returns updated product with optional editorial overrides.
 */
export async function handleUpdateProduct(args: unknown): Promise<McpToolResponse> {
  const parsed = UpdateProductInputSchema.safeParse(args);
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const { 
    id, 
    title, 
    description, 
    price_min, 
    price_max, 
    image_url, 
    category,
    badges,
    editorial_stance,
    tested_in_house
  } = parsed.data;

  const result = await catalogRepository.updateProduct(id, {
    title,
    description,
    priceMin: price_min,
    priceMax: price_max,
    imageUrl: image_url,
    categoryId: category,
    badges,
    editorialStance: editorial_stance,
    editorial_stance,
    testedInHouse: tested_in_house,
    tested_in_house
  } as any);

  if (!result.success || !result.product) {
    return { ok: false, error: sanitizeErrorMessage(result.error || 'Product not found') };
  }

  return { ok: true, data: result.product };
}

/**
 * 4. set_product_status
 * Status change only (draft|active|paused|archived). No delete or user data tools exist.
 */
export async function handleSetProductStatus(args: unknown): Promise<McpToolResponse> {
  const parsed = SetProductStatusInputSchema.safeParse(args);
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const updated = await catalogRepository.toggleProductStatus(parsed.data.id, parsed.data.status);
  if (!updated) {
    return { ok: false, error: sanitizeErrorMessage('Product not found') };
  }

  return {
    ok: true,
    data: {
      id: updated.id,
      slug: updated.slug,
      status: updated.status
    }
  };
}

/**
 * 5. get_clicks
 * Returns { total_clicks, clicks_by_day: [{date, count}], top_products: [{title, clicks}] }
 */
export async function handleGetClicks(args: unknown): Promise<McpToolResponse> {
  const parsed = GetClicksInputSchema.safeParse(args || {});
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const report = catalogRepository.getClicksReport(parsed.data.days ?? 7);
  return { ok: true, data: report };
}

/**
 * 6. mark_price_checked
 * Updates lastCheckedAt timestamp on affiliate link and last_price_checked_at in Supabase products table.
 */
export async function handleMarkPriceChecked(args: unknown): Promise<McpToolResponse> {
  const parsed = MarkPriceCheckedInputSchema.safeParse(args);
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const newTimestamp = await catalogRepository.markPriceChecked(parsed.data.product_id);
  if (!newTimestamp) {
    return { ok: false, error: sanitizeErrorMessage('Product or affiliate link not found') };
  }

  return {
    ok: true,
    data: {
      product_id: parsed.data.product_id,
      lastCheckedAt: newTimestamp,
      last_price_checked_at: newTimestamp
    }
  };
}

/**
 * 7. get_stale_prices
 * Products where lastCheckedAt + staleAfter < now, with { title, url, lastCheckedAt, staleAfter }
 */
export async function handleGetStalePrices(args: unknown): Promise<McpToolResponse> {
  const parsed = GetStalePricesInputSchema.safeParse(args || {});
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const staleList = catalogRepository.getStalePricesReport();
  return { ok: true, data: staleList };
}

/**
 * 8. store_stats
 * Returns { products_by_status, clicks_7d, clicks_30d, assistant_conversations_7d }
 */
export async function handleStoreStats(args: unknown): Promise<McpToolResponse> {
  const parsed = StoreStatsInputSchema.safeParse(args || {});
  if (!parsed.success) {
    return { ok: false, error: sanitizeErrorMessage(`validation: ${parsed.error.issues.map(i => i.message).join(', ')}`) };
  }

  const stats = catalogRepository.getStoreMcpStats();
  return { ok: true, data: stats };
}

/**
 * Dispatcher mapping tool name to handler
 */
export async function executeMcpTool(name: string, args: unknown): Promise<McpToolResponse> {
  switch (name) {
    case 'list_products':
      return handleListProducts(args);
    case 'add_product':
      return handleAddProduct(args);
    case 'update_product':
      return handleUpdateProduct(args);
    case 'set_product_status':
      return handleSetProductStatus(args);
    case 'get_clicks':
      return handleGetClicks(args);
    case 'mark_price_checked':
      return handleMarkPriceChecked(args);
    case 'get_stale_prices':
      return handleGetStalePrices(args);
    case 'store_stats':
      return handleStoreStats(args);
    default:
      return { ok: false, error: sanitizeErrorMessage(`Unknown MCP tool: "${name}"`) };
  }
}
