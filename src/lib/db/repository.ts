import { 
  Product, 
  MerchantOffer, 
  OwnedProduct, 
  Collection, 
  Book,
  MerchantName
} from '../../types';
import { 
  PRODUCTS as INITIAL_PRODUCTS, 
  MERCHANT_OFFERS as INITIAL_OFFERS, 
  OWNED_PRODUCTS as INITIAL_OWNED, 
  COLLECTIONS as INITIAL_COLLECTIONS, 
  BOOKS as INITIAL_BOOKS 
} from '../../data/seedCatalog';
import { 
  ProductInput, 
  ProductInputSchema, 
  ProductStatus, 
  CategoryInput, 
  OwnProductInput, 
  validateAffiliateUrlForNetwork, 
  MerchantNetwork 
} from './schema';
import { isSupabaseConfigured, getSupabaseEnv } from '../supabase/config';
import { getSupabaseAdminClient } from '../supabase/server';
import { 
  mapSupabaseRowToProduct, 
  mapProductInputToSupabaseRow, 
  mapProductUpdateToSupabaseRow,
  sanitizeValidUrl,
  sanitizeAffiliateUrl,
  sanitizePriceBound,
  SupabaseProductRow
} from './supabaseMapper';

const TABLE_PRODUCTS = 'products';

export interface AffiliateLinkRecord {
  id: string;
  productId: string;
  network: MerchantNetwork;
  url: string;
  relTag: string;
  lastCheckedAt: string;
  staleAfterDays: number;
  clickCount: number;
}

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  parentId?: string;
  sortOrder: number;
}

export interface ClickRecord {
  id: string;
  linkId: string;
  productId: string;
  ts: string;
  referrer?: string;
  country: string;
}

export interface AssistantLogRecord {
  id: string;
  ts: string;
  sessionId: string;
  userMessage: string;
  assistantReply: string;
  productsReferenced: string[];
  isHallucination: boolean;
}

export interface DashboardStats {
  totalActiveProducts: number;
  clicksLast7d: number;
  clicksLast30d: number;
  topProduct?: { id: string; name: string; clicks: number };
  topProducts: { id: string; name: string; merchant: string; clicks: number; price: number }[];
  staleProducts: { id: string; name: string; lastCheckedAt: string; daysAgo: number }[];
  assistantConversations7d: number;
  recentQuestions: { question: string; ts: string; hallucination: boolean }[];
  hallucinationCount: number;
}

// In-Memory Repository Store with Global Singleton guarantee in development
class CatalogRepository {
  private products: Product[] = [];
  private offers: MerchantOffer[] = [];
  private links: AffiliateLinkRecord[] = [];
  private categories: CategoryRecord[] = [];
  private ownedProducts: OwnedProduct[] = [];
  private collections: Collection[] = [];
  private books: Book[] = [];
  private clicks: ClickRecord[] = [];
  private assistantLogs: AssistantLogRecord[] = [];

  constructor() {
    this.reset();
    if (process.env.NODE_ENV !== 'test') {
      const backend = this.getBackendMode();
      console.log(`[CatalogRepository] Backend mode: ${backend.mode} (${backend.details})`);
    }
  }

  public getBackendMode(): { mode: 'supabase' | 'in-memory-mock'; details: string } {
    const env = getSupabaseEnv();
    if (isSupabaseConfigured()) {
      return {
        mode: 'supabase',
        details: `Connected to Supabase at ${env.url}`
      };
    }
    if (env.hasValidUrl && !env.hasValidAnonKey) {
      return {
        mode: 'in-memory-mock',
        details: `Supabase URL is present (${env.url}) but anon key is missing or set to placeholder. Operating in fallback in-memory mode.`
      };
    }
    return {
      mode: 'in-memory-mock',
      details: 'Operating in local in-memory catalog mode with seed data.'
    };
  }

  public reset() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.offers = JSON.parse(JSON.stringify(INITIAL_OFFERS));
    this.ownedProducts = JSON.parse(JSON.stringify(INITIAL_OWNED));
    this.collections = JSON.parse(JSON.stringify(INITIAL_COLLECTIONS));
    this.books = JSON.parse(JSON.stringify(INITIAL_BOOKS));

    // Categories initialization
    const uniqueCats = Array.from(new Set(this.products.map(p => p.category)));
    this.categories = uniqueCats.map((name, idx) => ({
      id: `cat-${idx + 1}`,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      sortOrder: idx
    }));

    // Affiliate links initialization from offers
    this.links = this.offers.map((o, idx) => {
      let network: MerchantNetwork = 'direct';
      if (o.merchantName === 'Amazon') network = 'amazon';
      else if (o.merchantName === 'Gumroad') network = 'gumroad';

      return {
        id: `link-${idx + 1}`,
        productId: o.productId,
        network,
        url: o.affiliateUrl,
        relTag: 'sponsored nofollow noopener',
        lastCheckedAt: o.lastCheckedAt,
        staleAfterDays: o.staleAfterDays,
        clickCount: Math.floor(Math.random() * 45) + 12 // realistic seed clicks
      };
    });

    // Seed realistic click logs
    this.clicks = [];
    const now = Date.now();
    for (const l of this.links) {
      for (let i = 0; i < l.clickCount; i++) {
        const daysBack = Math.random() * 25;
        this.clicks.push({
          id: `click_${Math.random().toString(36).slice(2, 9)}`,
          linkId: l.id,
          productId: l.productId,
          ts: new Date(now - daysBack * 24 * 60 * 60 * 1000).toISOString(),
          referrer: i % 2 === 0 ? 'https://google.com' : 'Direct',
          country: 'US'
        });
      }
    }

    // Seed sample assistant logs
    this.assistantLogs = [
      {
        id: 'asst-1',
        ts: new Date(now - 3600000).toISOString(),
        sessionId: 'sess_seed_1',
        userMessage: 'Recommend an ergonomic mouse under $110',
        assistantReply: 'I recommend the Logitech MX Master 3S Wireless Mouse ($99.99). It fits within your $110 budget.',
        productsReferenced: ['prod-2'],
        isHallucination: false
      },
      {
        id: 'asst-2',
        ts: new Date(now - 7200000).toISOString(),
        sessionId: 'sess_seed_2',
        userMessage: 'Best desk lighting for dual monitors',
        assistantReply: 'The BenQ ScreenBar Plus Monitor Light provides asymmetric glare-free desk illumination.',
        productsReferenced: ['prod-1'],
        isHallucination: false
      }
    ];
  }

  // --- PRODUCTS CRUD ---
  public getProducts(filter?: { status?: string; category?: string; merchant?: string; staleOnly?: boolean }): Product[] {
    let list = [...this.products];
    if (filter?.status && filter.status !== 'all') {
      list = list.filter(p => p.status === filter.status);
    }
    if (filter?.category && filter.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.merchant && filter.merchant !== 'all') {
      list = list.filter(p => {
        const offer = this.offers.find(o => o.productId === p.id);
        return offer && offer.merchantName.toLowerCase() === filter.merchant!.toLowerCase();
      });
    }
    if (filter?.staleOnly) {
      list = list.filter(p => {
        const offer = this.offers.find(o => o.productId === p.id);
        if (!offer) return false;
        const checked = new Date(offer.lastCheckedAt).getTime();
        const staleLimit = offer.staleAfterDays * 24 * 60 * 60 * 1000;
        return (Date.now() - checked) > staleLimit;
      });
    }
    return list;
  }

  public getProductByIdSync(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
          .from(TABLE_PRODUCTS)
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          const product = mapSupabaseRowToProduct(data as SupabaseProductRow);
          const idx = this.products.findIndex(p => p.id === id);
          if (idx >= 0) this.products[idx] = product;
          else this.products.unshift(product);
          return product;
        }
      } catch (err) {
        console.error('[CatalogRepository] getProductById Supabase error:', err);
      }
    }
    return this.getProductByIdSync(id);
  }

  public getProductBySlugSync(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  public async getProductBySlug(slug: string): Promise<Product | undefined> {
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
          .from(TABLE_PRODUCTS)
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          const product = mapSupabaseRowToProduct(data as SupabaseProductRow);
          const idx = this.products.findIndex(p => p.id === product.id || p.slug === slug);
          if (idx >= 0) this.products[idx] = product;
          else this.products.unshift(product);
          return product;
        }
      } catch (err) {
        console.error('[CatalogRepository] getProductBySlug Supabase error:', err);
      }
    }
    return this.getProductBySlugSync(slug);
  }

  public async getAllProducts(filter?: { status?: string; category?: string; merchant?: string; staleOnly?: boolean }): Promise<Product[]> {
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        let query = supabase.from(TABLE_PRODUCTS).select('*');
        if (filter?.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        const { data, error } = await query;
        if (error) {
          console.error('[CatalogRepository] getAllProducts error from Supabase:', error.message);
        } else if (data && data.length > 0) {
          const mapped = data.map((row) => mapSupabaseRowToProduct(row as SupabaseProductRow));
          for (const p of mapped) {
            const idx = this.products.findIndex(existing => existing.id === p.id);
            if (idx >= 0) this.products[idx] = p;
            else this.products.unshift(p);
          }
          return this.applyProductFilters(mapped, filter);
        }
      } catch (err) {
        console.error('[CatalogRepository] getAllProducts exception:', err);
      }
    }
    return this.getProducts(filter);
  }

  private applyProductFilters(list: Product[], filter?: { status?: string; category?: string; merchant?: string; staleOnly?: boolean }): Product[] {
    let result = [...list];
    if (filter?.status && filter.status !== 'all') {
      result = result.filter(p => p.status === filter.status);
    }
    if (filter?.category && filter.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.merchant && filter.merchant !== 'all') {
      result = result.filter(p => {
        const offer = this.offers.find(o => o.productId === p.id);
        return offer && offer.merchantName.toLowerCase() === filter.merchant!.toLowerCase();
      });
    }
    if (filter?.staleOnly) {
      result = result.filter(p => {
        const offer = this.offers.find(o => o.productId === p.id);
        if (!offer) return false;
        const checked = new Date(offer.lastCheckedAt).getTime();
        const staleLimit = offer.staleAfterDays * 24 * 60 * 60 * 1000;
        return (Date.now() - checked) > staleLimit;
      });
    }
    return result;
  }

  public async createProduct(input: ProductInput): Promise<{ success: boolean; product?: Product; error?: string }> {
    // 1. Validate Input
    const parsed = ProductInputSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
    }

    const data = parsed.data;

    // 2. Enforce slug uniqueness in memory
    if (this.products.some(p => p.slug === data.slug)) {
      return { success: false, error: `Product slug "${data.slug}" is already taken.` };
    }

    // 3. Find category and merchant names
    const category = this.categories.find(c => c.id === data.categoryId || c.name === data.categoryId)?.name || data.categoryId;
    let merchantName = data.merchantId;
    let network: MerchantNetwork = 'direct';

    if (data.merchantId.toLowerCase().includes('amazon')) {
      merchantName = 'Amazon';
      network = 'amazon';
    } else if (data.merchantId.toLowerCase().includes('gumroad')) {
      merchantName = 'Gumroad';
      network = 'gumroad';
    }

    // 4. Validate affiliate URL format per network
    if (!validateAffiliateUrlForNetwork(data.affiliateUrl, network)) {
      return { success: false, error: `Affiliate URL is not valid for ${network} network format.` };
    }

    const newId = `prod-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const safeAffiliateUrl = sanitizeAffiliateUrl(data.affiliateUrl);
    const safePriceMin = sanitizePriceBound(data.priceMin) ?? 0;
    const safePriceMax = sanitizePriceBound(data.priceMax) ?? undefined;
    const safeImageUrl = sanitizeValidUrl(data.imageUrl, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80')!;

    const newProduct: Product = {
      id: newId,
      slug: data.slug,
      name: data.title,
      brand: data.brand || 'EveryAge Curated',
      description: data.description,
      productType: data.isOwned ? 'digital' : 'physical',
      category,
      subcategory: 'General',
      useCases: ['Daily productivity', 'Everyday utility'],
      bestFor: data.bestFor || 'Shoppers looking for reliable tested essentials.',
      notFor: data.notFor || 'Users seeking cheap disposable alternatives.',
      features: ['Editorial vetted', 'Verified merchant warranty'],
      benefits: ['High durability', 'Direct merchant fulfillment'],
      limitations: data.notFor ? [data.notFor] : ['Standard merchant shipping policies apply'],
      sourceProvider: merchantName,
      imageUrl: safeImageUrl,
      imageSource: 'Brand Press Kit',
      imageLicense: 'Official Affiliate Feed',
      altText: data.title,
      region: ['US', 'Global'],
      language: 'en',
      status: data.status,
      editorialNotes: 'Added via EveryAge Digital admin control center.',
      handsOnTested: true,
      editorialConfidence: 'High',
      editorialBadge: data.editorialBadge as Product['editorialBadge'],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const newOffer: MerchantOffer = {
      id: `off-${newId}`,
      productId: newId,
      merchantName: merchantName as MerchantName,
      providerName: merchantName,
      affiliateProgram: `prog-${network}`,
      originalUrl: safeAffiliateUrl,
      affiliateUrl: safeAffiliateUrl,
      currency: (data.currency || 'USD').trim().toUpperCase(),
      price: safePriceMin,
      originalPrice: safePriceMax,
      priceType: 'fixed',
      availability: 'in_stock',
      region: ['Global'],
      lastCheckedAt: nowIso,
      staleAfterDays: 7,
      active: true
    };

    const newLink: AffiliateLinkRecord = {
      id: `link-${newId}`,
      productId: newId,
      network,
      url: safeAffiliateUrl,
      relTag: 'sponsored nofollow noopener',
      lastCheckedAt: nowIso,
      staleAfterDays: 7,
      clickCount: 0
    };

    // If Supabase is active, execute database insert
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const { data: existing } = await supabase
          .from(TABLE_PRODUCTS)
          .select('id')
          .eq('slug', data.slug)
          .maybeSingle();

        if (existing) {
          return { success: false, error: `Product slug "${data.slug}" is already taken.` };
        }

        const dbRow = mapProductInputToSupabaseRow(data, newId);
        const { error: sbError } = await supabase.from(TABLE_PRODUCTS).insert(dbRow);
        if (sbError) {
          console.error('[CatalogRepository] Supabase createProduct insert error:', sbError);
          return { success: false, error: sbError.message };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Database insert failed';
        console.error('[CatalogRepository] Supabase createProduct exception:', err);
        return { success: false, error: message };
      }
    }

    this.products.unshift(newProduct);
    this.offers.unshift(newOffer);
    this.links.unshift(newLink);

    return { success: true, product: newProduct };
  }

  public async updateProduct(id: string, input: Partial<ProductInput>): Promise<{ success: boolean; product?: Product; error?: string }> {
    let index = this.products.findIndex(p => p.id === id);
    if (index === -1 && this.getBackendMode().mode === 'supabase') {
      await this.getProductById(id);
      index = this.products.findIndex(p => p.id === id);
    }
    if (index === -1) return { success: false, error: 'Product not found' };

    const current = this.products[index];

    // If slug changed, verify uniqueness
    if (input.slug && input.slug !== current.slug) {
      if (this.products.some(p => p.slug === input.slug && p.id !== id)) {
        return { success: false, error: `Slug "${input.slug}" is already taken.` };
      }
      current.slug = input.slug;
    }

    if (input.title) current.name = input.title;
    if (input.description) current.description = input.description;
    if (input.brand !== undefined) current.brand = input.brand;
    if (input.status) current.status = input.status;
    if (input.bestFor) current.bestFor = input.bestFor;
    if (input.notFor) current.notFor = input.notFor;
    if (input.editorialBadge !== undefined) current.editorialBadge = input.editorialBadge as Product['editorialBadge'];
    if (input.imageUrl) current.imageUrl = sanitizeValidUrl(input.imageUrl, current.imageUrl) || current.imageUrl;

    current.updatedAt = new Date().toISOString();

    // Update offer price if passed
    const offer = this.offers.find(o => o.productId === id);
    if (offer && input.priceMin !== undefined) {
      const parsedPrice = sanitizePriceBound(input.priceMin);
      if (parsedPrice !== null) offer.price = parsedPrice;
      offer.lastCheckedAt = new Date().toISOString();
    }

    // Update link URL if passed
    if (input.affiliateUrl) {
      const safeAffUrl = sanitizeAffiliateUrl(input.affiliateUrl);
      const link = this.links.find(l => l.productId === id);
      if (link) {
        link.url = safeAffUrl;
        link.lastCheckedAt = new Date().toISOString();
      }
      if (offer) {
        offer.affiliateUrl = safeAffUrl;
      }
    }

    // If Supabase is active, execute database update
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const updateRow = mapProductUpdateToSupabaseRow(input);
        const { error: sbError } = await supabase
          .from(TABLE_PRODUCTS)
          .update(updateRow)
          .eq('id', id);

        if (sbError) {
          console.error('[CatalogRepository] Supabase updateProduct error:', sbError);
          return { success: false, error: sbError.message };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Database update failed';
        console.error('[CatalogRepository] Supabase updateProduct exception:', err);
        return { success: false, error: message };
      }
    }

    return { success: true, product: current };
  }

  public async deleteProduct(id: string): Promise<boolean> {
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const { error: sbError } = await supabase.from(TABLE_PRODUCTS).delete().eq('id', id);
        if (sbError) {
          console.error('[CatalogRepository] Supabase deleteProduct error:', sbError);
          return false;
        }
      } catch (err) {
        console.error('[CatalogRepository] Supabase deleteProduct exception:', err);
        return false;
      }
    }

    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    this.offers = this.offers.filter(o => o.productId !== id);
    this.links = this.links.filter(l => l.productId !== id);
    return true;
  }

  public async toggleProductStatus(id: string, status: ProductStatus): Promise<Product | undefined> {
    const res = await this.updateProduct(id, { status });
    return res.product;
  }

  public getOfferForProduct(productId: string): MerchantOffer | undefined {
    return this.offers.find(o => o.productId === productId && o.active);
  }

  public getOffers(): MerchantOffer[] {
    return this.offers;
  }

  // --- AFFILIATE LINKS & CLICK TRACKING ---
  public getLinks(): (AffiliateLinkRecord & { productName: string; merchant: string; isStale: boolean; daysAgo: number })[] {
    const now = Date.now();
    return this.links.map(link => {
      const prod = this.products.find(p => p.id === link.productId);
      const offer = this.offers.find(o => o.productId === link.productId);
      const checkedTime = new Date(link.lastCheckedAt).getTime();
      const daysAgo = Math.floor((now - checkedTime) / (1000 * 60 * 60 * 24));
      return {
        ...link,
        productName: prod ? prod.name : 'Unknown Product',
        merchant: offer ? offer.merchantName : link.network,
        daysAgo,
        isStale: daysAgo > link.staleAfterDays
      };
    });
  }

  public markLinkChecked(linkIdOrProductId: string): boolean {
    const link = this.links.find(l => l.id === linkIdOrProductId || l.productId === linkIdOrProductId);
    if (!link) return false;
    const now = new Date().toISOString();
    link.lastCheckedAt = now;

    const offer = this.offers.find(o => o.productId === link.productId);
    if (offer) {
      offer.lastCheckedAt = now;
    }
    return true;
  }

  public markPriceChecked(productId: string): string | null {
    const link = this.links.find(l => l.productId === productId || l.id === productId);
    if (!link) return null;
    const now = new Date().toISOString();
    link.lastCheckedAt = now;
    const offer = this.offers.find(o => o.productId === link.productId);
    if (offer) {
      offer.lastCheckedAt = now;
    }
    return now;
  }

  public recordClick(linkIdOrProductId: string, referrer?: string, country: string = 'US'): string | null {
    // Lookup link by linkId OR by productId
    const link = this.links.find(l => l.id === linkIdOrProductId || l.productId === linkIdOrProductId);
    if (!link) return null;

    link.clickCount += 1;
    this.clicks.push({
      id: `click_${Date.now()}`,
      linkId: link.id,
      productId: link.productId,
      ts: new Date().toISOString(),
      referrer,
      country
    });

    return link.url;
  }

  // --- CATEGORIES ---
  public getCategories(): (CategoryRecord & { productCount: number })[] {
    return this.categories.map(cat => ({
      ...cat,
      productCount: this.products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
    }));
  }

  public createCategory(input: CategoryInput): CategoryRecord {
    const newCat: CategoryRecord = {
      id: `cat-${Date.now()}`,
      slug: input.slug,
      name: input.name,
      parentId: input.parentId,
      sortOrder: input.sortOrder
    };
    this.categories.push(newCat);
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);
    return true;
  }

  // --- OWN PRODUCTS ---
  public getOwnProducts(): OwnedProduct[] {
    return this.ownedProducts;
  }

  public updateOwnProduct(id: string, input: Partial<OwnProductInput>): OwnedProduct | undefined {
    const p = this.ownedProducts.find(item => item.id === id);
    if (!p) return undefined;
    if (input.title) p.title = input.title;
    if (input.price !== undefined) p.price = input.price;
    if (input.deliveryInfo) p.tagline = input.deliveryInfo;
    if (input.refundPolicy) p.refundPolicy = input.refundPolicy;
    if (input.checkoutProvider) p.paymentProvider = input.checkoutProvider === 'lemonsqueezy' ? 'Lemon Squeezy' : input.checkoutProvider === 'paddle' ? 'Paddle' : 'Demo';
    p.updatedAt = new Date().toISOString();
    return p;
  }

  // --- ASSISTANT LOGS & HALLUCINATION ALARM ---
  public logAssistantConversation(sessionId: string, userMessage: string, reply: string, referencedProductIds: string[]): AssistantLogRecord {
    // Hallucination Alarm: check if any referenced product ID does NOT exist in catalog!
    const catalogIds = new Set(this.products.map(p => p.id));
    const hasUncatalogedItem = referencedProductIds.some(id => !catalogIds.has(id));

    const log: AssistantLogRecord = {
      id: `asst-${Date.now()}`,
      ts: new Date().toISOString(),
      sessionId,
      userMessage,
      assistantReply: reply,
      productsReferenced: referencedProductIds,
      isHallucination: hasUncatalogedItem
    };

    this.assistantLogs.unshift(log);
    return log;
  }

  public getAssistantLogs(): AssistantLogRecord[] {
    return this.assistantLogs;
  }

  // --- DASHBOARD STATS ---
  public getDashboardStats(): DashboardStats {
    const activeProducts = this.products.filter(p => p.status === 'active');
    const now = Date.now();
    const ms7d = 7 * 24 * 60 * 60 * 1000;
    const ms30d = 30 * 24 * 60 * 60 * 1000;

    const clicks7d = this.clicks.filter(c => (now - new Date(c.ts).getTime()) <= ms7d).length;
    const clicks30d = this.clicks.filter(c => (now - new Date(c.ts).getTime()) <= ms30d).length;

    // Top products by clicks
    const productClickMap: Record<string, number> = {};
    for (const link of this.links) {
      productClickMap[link.productId] = link.clickCount;
    }

    const sortedByClicks = [...this.products]
      .map(p => {
        const offer = this.offers.find(o => o.productId === p.id);
        return {
          id: p.id,
          name: p.name,
          merchant: offer ? offer.merchantName : 'Partner',
          clicks: productClickMap[p.id] || 0,
          price: offer ? offer.price : 0
        };
      })
      .sort((a, b) => b.clicks - a.clicks);

    // Stale products
    const staleProducts = this.products
      .map(p => {
        const offer = this.offers.find(o => o.productId === p.id);
        if (!offer) return null;
        const diffDays = Math.floor((now - new Date(offer.lastCheckedAt).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > offer.staleAfterDays) {
          return {
            id: p.id,
            name: p.name,
            lastCheckedAt: offer.lastCheckedAt,
            daysAgo: diffDays
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const conversations7d = this.assistantLogs.filter(l => (now - new Date(l.ts).getTime()) <= ms7d).length;
    const hallucinationCount = this.assistantLogs.filter(l => l.isHallucination).length;

    return {
      totalActiveProducts: activeProducts.length,
      clicksLast7d: clicks7d,
      clicksLast30d: clicks30d,
      topProduct: sortedByClicks[0],
      topProducts: sortedByClicks.slice(0, 10),
      staleProducts,
      assistantConversations7d: conversations7d,
      recentQuestions: this.assistantLogs.slice(0, 5).map(l => ({
        question: l.userMessage,
        ts: l.ts,
        hallucination: l.isHallucination
      })),
      hallucinationCount
    };
  }

  // --- MCP SPECIFIC REUSABLE REPOSITORY METHODS ---
  public getProductsForMcp(filter?: { status?: string; category?: string }) {
    let prods = [...this.products];
    if (filter?.status) {
      prods = prods.filter(p => p.status === filter.status);
    }
    if (filter?.category) {
      prods = prods.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }

    return prods.map(p => {
      const offer = this.offers.find(o => o.productId === p.id);
      const link = this.links.find(l => l.productId === p.id);
      return {
        id: p.id,
        slug: p.slug,
        title: p.name,
        category: p.category,
        merchant: offer ? offer.merchantName : 'Direct',
        price_min: offer ? offer.price : 0,
        price_max: offer?.originalPrice ?? (offer ? offer.price : 0),
        currency: offer ? offer.currency : 'USD',
        status: p.status,
        clicks: link ? link.clickCount : 0
      };
    });
  }

  public getClicksReport(days: number = 7) {
    const now = Date.now();
    const windowMs = days * 24 * 60 * 60 * 1000;
    const filteredClicks = this.clicks.filter(c => (now - new Date(c.ts).getTime()) <= windowMs);

    // Group clicks by day (YYYY-MM-DD)
    const dayMap: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      dayMap[d] = 0;
    }
    for (const c of filteredClicks) {
      const d = c.ts.split('T')[0];
      if (dayMap[d] !== undefined) {
        dayMap[d] += 1;
      } else {
        dayMap[d] = 1;
      }
    }
    const clicks_by_day = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    // Top products by clicks
    const prodClickMap: Record<string, number> = {};
    for (const c of filteredClicks) {
      prodClickMap[c.productId] = (prodClickMap[c.productId] || 0) + 1;
    }

    const top_products = Object.entries(prodClickMap)
      .map(([productId, clicks]) => {
        const prod = this.products.find(p => p.id === productId);
        return {
          title: prod ? prod.name : productId,
          clicks
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    return {
      total_clicks: filteredClicks.length,
      clicks_by_day,
      top_products
    };
  }

  public getStalePricesReport() {
    const now = Date.now();
    const results: { title: string; url: string; lastCheckedAt: string; staleAfter: number }[] = [];
    for (const p of this.products) {
      const link = this.links.find(l => l.productId === p.id);
      if (!link) continue;
      const checked = new Date(link.lastCheckedAt).getTime();
      const staleLimit = link.staleAfterDays * 24 * 60 * 60 * 1000;
      if ((now - checked) > staleLimit) {
        results.push({
          title: p.name,
          url: link.url,
          lastCheckedAt: link.lastCheckedAt,
          staleAfter: link.staleAfterDays
        });
      }
    }
    return results;
  }

  public getStoreMcpStats() {
    const products_by_status = {
      draft: this.products.filter(p => p.status === 'draft').length,
      active: this.products.filter(p => p.status === 'active').length,
      paused: this.products.filter(p => p.status === 'paused').length,
      archived: this.products.filter(p => p.status === 'archived').length
    };

    const now = Date.now();
    const ms7d = 7 * 24 * 60 * 60 * 1000;
    const ms30d = 30 * 24 * 60 * 60 * 1000;
    const clicks_7d = this.clicks.filter(c => (now - new Date(c.ts).getTime()) <= ms7d).length;
    const clicks_30d = this.clicks.filter(c => (now - new Date(c.ts).getTime()) <= ms30d).length;
    const assistant_conversations_7d = this.assistantLogs.filter(l => (now - new Date(l.ts).getTime()) <= ms7d).length;

    return {
      products_by_status,
      clicks_7d,
      clicks_30d,
      assistant_conversations_7d
    };
  }
}

// Global Singleton to preserve repository mutations across Hot Reloads & Server Actions
const globalForRepo = global as unknown as { catalogRepository: CatalogRepository };
export const catalogRepository = globalForRepo.catalogRepository || new CatalogRepository();
if (process.env.NODE_ENV !== 'production') globalForRepo.catalogRepository = catalogRepository;
