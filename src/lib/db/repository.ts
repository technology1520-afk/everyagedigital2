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
import { isSupabaseConfigured, isSupabaseAdminConfigured, getSupabaseEnv } from '../supabase/config';
import { getSupabaseAdminClient } from '../supabase/server';
import { 
  mapSupabaseRowToProduct, 
  mapSupabaseRowToOffer,
  mapProductInputToSupabaseRow, 
  mapProductUpdateToSupabaseRow,
  sanitizeValidUrl,
  sanitizeAffiliateUrl,
  sanitizePriceBound,
  SupabaseProductRow,
  getCollectionBannerImage
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
  private seasonalTheme: { active: boolean; theme: string } = { active: false, theme: 'halloween' };

  constructor() {
    this.reset();
    if (process.env.NODE_ENV === 'development') {
      const backend = this.getBackendMode();
      console.log(`[CatalogRepository] Backend mode: ${backend.mode} (${backend.details})`);
    }
  }

  public getBackendMode(): { mode: 'supabase' | 'in-memory-mock'; details: string } {
    const env = getSupabaseEnv();
    if (isSupabaseConfigured() || isSupabaseAdminConfigured()) {
      return {
        mode: 'supabase',
        details: `Connected to Supabase at ${env.url}`
      };
    }
    if (env.hasValidUrl && !env.hasValidAnonKey && !env.hasValidServiceKey) {
      return {
        mode: 'in-memory-mock',
        details: `Supabase URL is present (${env.url}) but keys are missing or set to placeholder. Operating in fallback in-memory mode.`
      };
    }
    return {
      mode: 'in-memory-mock',
      details: 'Operating in local in-memory catalog mode with seed data.'
    };
  }

  public reset() {
    if (this.getBackendMode().mode === 'supabase') {
      this.products = [];
      this.offers = [];
      this.links = [];
      this.ownedProducts = JSON.parse(JSON.stringify(INITIAL_OWNED));
      this.collections = JSON.parse(JSON.stringify(INITIAL_COLLECTIONS));
      this.books = [];
      this.clicks = [];
      this.assistantLogs = [];

      const defaultCategoryNames = [
        'Ergonomics & Peripherals',
        'Smart Audio & Microphones',
        'Home Office & Lighting',
        'Health & Wellness Tech',
        'Focus & Time Tools'
      ];
      this.categories = defaultCategoryNames.map((name, idx) => ({
        id: `cat-${idx + 1}`,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        sortOrder: idx
      }));
      return;
    }

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

  /**
   * Ensures a corresponding MerchantOffer and AffiliateLinkRecord exist in memory
   * for a product fetched from Supabase, guaranteeing valid numeric prices and affiliate URLs.
   */
  public ensureOfferForSupabaseProduct(row: SupabaseProductRow): MerchantOffer {
    const existingIdx = this.offers.findIndex(o => o.productId === row.id);
    const offer = mapSupabaseRowToOffer(row);
    if (existingIdx >= 0) {
      this.offers[existingIdx] = offer;
    } else {
      this.offers.unshift(offer);
    }

    const existingLinkIdx = this.links.findIndex(l => l.productId === row.id);
    let network: MerchantNetwork = 'direct';
    const merchantLower = (row.merchant_id || '').toLowerCase();
    if (merchantLower.includes('amazon')) network = 'amazon';
    else if (merchantLower.includes('gumroad')) network = 'gumroad';

    const rawAffiliateUrl = row.affiliate_url || row.affiliate_links?.[0]?.url;
    const safeUrl = sanitizeAffiliateUrl(rawAffiliateUrl);
    const linkRecord: AffiliateLinkRecord = {
      id: `link-${row.id}`,
      productId: row.id,
      network,
      url: safeUrl,
      relTag: 'sponsored nofollow noopener',
      lastCheckedAt: row.updated_at || row.created_at || new Date().toISOString(),
      staleAfterDays: 7,
      clickCount: 0
    };

    if (existingLinkIdx >= 0) {
      this.links[existingLinkIdx] = {
        ...this.links[existingLinkIdx],
        url: safeUrl,
        network
      };
    } else {
      this.links.unshift(linkRecord);
    }

    return offer;
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
          .select('*, affiliate_links(*)')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          const row = data as SupabaseProductRow;
          this.ensureOfferForSupabaseProduct(row);
          const product = mapSupabaseRowToProduct(row);
          const idx = this.products.findIndex(p => p.id === id);
          if (idx >= 0) this.products[idx] = product;
          else this.products.unshift(product);
          return product;
        }
        return undefined;
      } catch (err) {
        console.error('[CatalogRepository] getProductById Supabase error:', err);
        return undefined;
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
          .select('*, affiliate_links(*)')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          const row = data as SupabaseProductRow;
          this.ensureOfferForSupabaseProduct(row);
          const product = mapSupabaseRowToProduct(row);
          const idx = this.products.findIndex(p => p.id === product.id || p.slug === slug);
          if (idx >= 0) this.products[idx] = product;
          else this.products.unshift(product);
          return product;
        }
        return undefined;
      } catch (err) {
        console.error('[CatalogRepository] getProductBySlug Supabase error:', err);
        return undefined;
      }
    }
    return this.getProductBySlugSync(slug);
  }

  public async getAllProducts(filter?: { status?: string; category?: string; merchant?: string; staleOnly?: boolean }): Promise<Product[]> {
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        let query = supabase.from(TABLE_PRODUCTS).select('*, affiliate_links(*)');
        if (filter?.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        const { data, error } = await query;
        if (error) {
          console.error('[CatalogRepository] getAllProducts error from Supabase:', error.message);
          return [];
        } else if (data) {
          const isFullFetch = !filter || (!filter.status && !filter.category && !filter.merchant && !filter.staleOnly) || filter.status === 'all';
          if (data.length === 0) {
            if (isFullFetch) {
              this.products = [];
              this.offers = [];
              this.links = [];
            }
            return [];
          }

          if (isFullFetch) {
            this.offers = [];
            this.links = [];
          }

          const mapped = data.map((row) => {
            this.ensureOfferForSupabaseProduct(row as SupabaseProductRow);
            return mapSupabaseRowToProduct(row as SupabaseProductRow);
          });

          if (isFullFetch) {
            this.products = mapped;
          } else {
            for (const p of mapped) {
              const idx = this.products.findIndex(existing => existing.id === p.id);
              if (idx >= 0) this.products[idx] = p;
              else this.products.push(p);
            }
          }

          for (const p of mapped) {
            if (p.category && !this.categories.some(c => c.name.toLowerCase() === p.category.toLowerCase())) {
              this.categories.push({
                id: `cat-${this.categories.length + 1}`,
                slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name: p.category,
                sortOrder: this.categories.length
              });
            }
          }

          return this.applyProductFilters(mapped, filter);
        }
      } catch (err) {
        console.error('[CatalogRepository] getAllProducts exception:', err);
        return [];
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
    const testedInHouse = data.testedInHouse !== undefined 
      ? Boolean(data.testedInHouse) 
      : (data.tested_in_house !== undefined ? Boolean(data.tested_in_house) : false);
    const badges = data.badges || [];
    const editorialStance = data.editorialStance || data.editorial_stance;
    const lastPriceCheckedAt = data.lastPriceCheckedAt || data.last_price_checked_at || nowIso;

    const newProduct: Product = {
      id: newId,
      slug: data.slug,
      name: data.title,
      brand: data.brand || 'EveryAge Curated',
      description: data.description,
      productType: data.isOwned ? 'digital' : 'physical',
      category,
      subcategory: 'General',
      useCases: ['Focused desktop ergonomics', 'High-throughput productivity'],
      bestFor: data.bestFor || 'Long-term desktop setups requiring tactile durability.',
      notFor: data.notFor || 'Minimalist travel kits prioritizing pocketability over endurance.',
      features: ['Editorial vetted', 'Verified merchant warranty'],
      benefits: ['High durability', 'Direct merchant fulfillment'],
      limitations: data.notFor ? [data.notFor] : ['Demands dedicated desktop footprint over ultra-compact travel gear'],
      sourceProvider: merchantName,
      imageUrl: safeImageUrl,
      imageSource: 'Brand Press Kit',
      imageLicense: 'Official Affiliate Feed',
      altText: data.title,
      region: ['US', 'Global'],
      language: 'en',
      status: data.status,
      editorialNotes: editorialStance || 'Added via EveryAge Digital admin control center.',
      handsOnTested: testedInHouse,
      editorialConfidence: 'High',
      editorialBadge: data.editorialBadge as Product['editorialBadge'],
      badges,
      editorialStance,
      editorial_stance: editorialStance,
      testedInHouse,
      tested_in_house: testedInHouse,
      lastPriceCheckedAt,
      last_price_checked_at: lastPriceCheckedAt,
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
      lastCheckedAt: lastPriceCheckedAt,
      staleAfterDays: 7,
      active: true
    };

    const newLink: AffiliateLinkRecord = {
      id: `link-${newId}`,
      productId: newId,
      network,
      url: safeAffiliateUrl,
      relTag: 'sponsored nofollow noopener',
      lastCheckedAt: lastPriceCheckedAt,
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

        if (safeAffiliateUrl) {
          const linkRow = {
            id: `link-${newId}`,
            product_id: newId,
            network,
            url: safeAffiliateUrl,
            rel_tag: 'sponsored nofollow noopener',
            last_checked_at: lastPriceCheckedAt,
            stale_after: 7,
            click_count: 0
          };
          const { error: linkErr } = await supabase.from('affiliate_links').insert(linkRow);
          if (linkErr) {
            console.warn('[CatalogRepository] Supabase affiliate link insert warning:', linkErr.message);
          }
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

    const extra = input as unknown as Record<string, unknown>;
    if (input.badges !== undefined || extra.badges !== undefined) {
      const bList = (input.badges ?? extra.badges) as string[];
      current.badges = bList;
      if (Array.isArray(bList)) {
        const found = bList.find((b: string) => 
          b === "Editor's Choice" || b === "Editor’s Choice" || b === "Best Value" || b === "Top Practical Pick" || b === "Creator Favorite"
        );
        if (found) {
          current.editorialBadge = found as Product['editorialBadge'];
        }
      }
    }
    if (input.editorialStance !== undefined || input.editorial_stance !== undefined || extra.editorial_stance !== undefined) {
      const stance = input.editorialStance ?? input.editorial_stance ?? (extra.editorial_stance as string);
      current.editorialStance = stance;
      current.editorial_stance = stance;
      current.editorialNotes = stance;
    }
    if (input.testedInHouse !== undefined || input.tested_in_house !== undefined || extra.tested_in_house !== undefined) {
      const tested = Boolean(input.testedInHouse ?? input.tested_in_house ?? extra.tested_in_house);
      current.testedInHouse = tested;
      current.tested_in_house = tested;
      current.handsOnTested = tested;
    }
    if (input.lastPriceCheckedAt !== undefined || input.last_price_checked_at !== undefined || extra.last_price_checked_at !== undefined) {
      const ts = input.lastPriceCheckedAt ?? input.last_price_checked_at ?? (extra.last_price_checked_at as string);
      current.lastPriceCheckedAt = ts;
      current.last_price_checked_at = ts;
    }

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

        // 1. Cascading delete from referencing tables to prevent foreign key violations
        try {
          await supabase.from('clicks').delete().eq('product_id', id);
        } catch (e) {
          console.warn('[CatalogRepository] Clicks delete warning:', e);
        }
        try {
          await supabase.from('click_events').delete().eq('product_id', id);
        } catch {
          // ignore if table does not exist
        }
        try {
          await supabase.from('affiliate_links').delete().eq('product_id', id);
        } catch (e) {
          console.warn('[CatalogRepository] Affiliate links delete warning:', e);
        }

        // Delete from collection_products join table
        try {
          await supabase.from('collection_products').delete().eq('product_id', id);
        } catch {
          // ignore if table does not exist
        }

        // Clean up from collections.product_ids array in Supabase
        try {
          const { data: cols } = await supabase.from('collections').select('id, product_ids');
          if (cols && Array.isArray(cols)) {
            for (const col of cols) {
              if (Array.isArray(col.product_ids) && col.product_ids.includes(id)) {
                const nextIds = col.product_ids.filter((pId: string) => pId !== id);
                await supabase.from('collections').update({ product_ids: nextIds }).eq('id', col.id);
              }
            }
          }
        } catch {
          // ignore
        }

        // 2. Delete product from products table
        const { error: sbError } = await supabase.from(TABLE_PRODUCTS).delete().eq('id', id);

        if (sbError) {
          console.warn('[CatalogRepository] Hard delete blocked by database constraint, performing soft-delete (archived):', sbError.message);
          // 3. Fallback: Perform soft-delete (status: "archived") if hard delete was blocked
          const { error: archiveError } = await supabase
            .from(TABLE_PRODUCTS)
            .update({ status: 'archived', updated_at: new Date().toISOString() })
            .eq('id', id);

          if (archiveError) {
            console.error('[CatalogRepository] Supabase soft-delete archive error:', archiveError.message);
            return false;
          }
        }
      } catch (err) {
        console.error('[CatalogRepository] Supabase deleteProduct exception:', err);
        return false;
      }
    }

    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.offers = this.offers.filter(o => o.productId !== id);
      this.links = this.links.filter(l => l.productId !== id);
    }

    // Clean up product from all collections in memory
    for (const c of this.collections) {
      if (Array.isArray(c.productIds)) {
        c.productIds = c.productIds.filter(pId => pId !== id);
      }
    }
    if (this.getBackendMode().mode === 'in-memory-mock' && index === -1) {
      return false;
    }
    return true;
  }

  public async toggleProductStatus(id: string, status: ProductStatus): Promise<Product | undefined> {
    const res = await this.updateProduct(id, { status });
    return res.product;
  }

  public seedOffers(offers: MerchantOffer[]): void {
    if (!Array.isArray(offers)) return;
    for (const o of offers) {
      const idx = this.offers.findIndex(existing => existing.id === o.id || existing.productId === o.productId);
      if (idx >= 0) {
        this.offers[idx] = o;
      } else {
        this.offers.push(o);
      }
    }
  }

  public ensureOfferForProduct(product: Product): MerchantOffer {
    const existing = this.offers.find(o => o.productId === product.id);
    if (existing) return existing;
    const merchantName: MerchantName = product.sourceProvider?.toLowerCase().includes('gumroad')
      ? 'Gumroad'
      : (product.brand?.toLowerCase().includes('gumroad') ? 'Gumroad' : 'Amazon');
    const offer: MerchantOffer = {
      id: `offer-${product.id}`,
      productId: product.id,
      merchantName,
      providerName: merchantName === 'Amazon' ? 'Amazon Associates' : 'Gumroad',
      affiliateProgram: merchantName === 'Amazon' ? 'Amazon Associates Program' : 'Gumroad Creator',
      originalUrl: product.officialUrl || `https://www.amazon.com/dp/${product.id}`,
      affiliateUrl: product.officialUrl || `https://www.amazon.com/dp/${product.id}?tag=everyagedigital-20`,
      currency: product.currency || 'USD',
      price: product.priceMin ?? product.price ?? 49.99,
      priceType: 'fixed',
      availability: 'in_stock',
      region: ['US', 'Global'],
      lastCheckedAt: new Date().toISOString(),
      staleAfterDays: 7,
      active: true
    };
    this.offers.push(offer);
    return offer;
  }

  public getOfferForProduct(productId: string): MerchantOffer | undefined {
    const existing = this.offers.find(o => o.productId === productId && o.active);
    if (existing) return existing;
    const seed = INITIAL_OFFERS.find(o => o.productId === productId && o.active);
    if (seed) return seed;
    const prod = this.products.find(p => p.id === productId);
    if (prod) {
      return this.ensureOfferForProduct(prod);
    }
    return undefined;
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

  public async markPriceChecked(productId: string): Promise<string | null> {
    let product = this.products.find(p => p.id === productId);
    let link = this.links.find(l => l.productId === productId || l.id === productId);

    if (!product && this.getBackendMode().mode === 'supabase') {
      await this.getProductById(productId);
      product = this.products.find(p => p.id === productId);
      link = this.links.find(l => l.productId === productId || l.id === productId);
    }

    if (!link && !product) return null;

    const now = new Date().toISOString();
    if (link) {
      link.lastCheckedAt = now;
    }
    const targetProductId = product ? product.id : (link ? link.productId : productId);
    const offer = this.offers.find(o => o.productId === targetProductId);
    if (offer) {
      offer.lastCheckedAt = now;
    }
    if (product) {
      product.lastPriceCheckedAt = now;
      product.last_price_checked_at = now;
      product.updatedAt = now;
    }

    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const { error: sbError } = await supabase
          .from(TABLE_PRODUCTS)
          .update({
            last_price_checked_at: now,
            updated_at: now
          })
          .eq('id', targetProductId);

        if (sbError) {
          console.error('[CatalogRepository] Supabase markPriceChecked error:', sbError);
        }
      } catch (err) {
        console.error('[CatalogRepository] Supabase markPriceChecked exception:', err);
      }
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

  // --- COLLECTIONS & BUNDLES ---
  public getCollections(): Collection[] {
    return this.collections.length > 0 ? this.collections : INITIAL_COLLECTIONS;
  }

  public getCollectionBySlugSync(slug: string): Collection | undefined {
    return this.collections.find(c => c.slug === slug) || INITIAL_COLLECTIONS.find(c => c.slug === slug);
  }

  public async getCollectionBySlug(slug: string, options?: { storefrontOnly?: boolean }): Promise<Collection | undefined> {
    let col: Collection | undefined = undefined;

    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const slugsToTry = [slug];
        if (slug === 'halloween-house-family-kit') slugsToTry.push('halloween-house-and-family-kit');
        else if (slug === 'halloween-house-and-family-kit') slugsToTry.push('halloween-house-family-kit');

        let data = null;
        let error = null;

        for (const s of slugsToTry) {
          const res = await supabase
            .from('collections')
            .select('*')
            .eq('slug', s)
            .maybeSingle();
          if (res.data) {
            data = res.data;
            break;
          }
          if (res.error && !error) {
            error = res.error;
          }
        }

        if (!error && data) {
          const row = data;
          const seed = INITIAL_COLLECTIONS.find(c => c.slug === row.slug || c.id === row.id);
          const rawProductIds: string[] = Array.isArray(row.product_ids) ? row.product_ids : (seed?.productIds || []);

          // Count and fetch active products in Supabase
          const { data: activeProds } = await supabase
            .from(TABLE_PRODUCTS)
            .select('id, slug, title, image_url, status')
            .in('id', rawProductIds.length > 0 ? rawProductIds : ['__none__'])
            .eq('status', 'active');

          const activeProdsList = activeProds || [];
          const activeIds = activeProdsList.map(p => p.id);
          const firstProductImage = activeProdsList[0]?.image_url;

          const bannerImg = (row.banner_image_url as string) || (seed as any)?.banner_image_url || (seed as any)?.bannerImageUrl || null;
          const imgUrl = (row.image_url as string) || (seed as any)?.image_url || (seed as any)?.imageUrl || null;
          const coverImgRaw = (row.cover_image as string) || seed?.coverImage || null;

          const resolvedProducts = activeProdsList.map(p => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            image_url: p.image_url,
            imageUrl: p.image_url
          }));

          const resolvedCover = getCollectionBannerImage(
            {
              banner_image_url: bannerImg,
              image_url: imgUrl || coverImgRaw,
              products: resolvedProducts
            },
            firstProductImage
          );

          col = {
            id: row.id,
            slug: row.slug,
            title: row.title,
            subtitle: seed?.subtitle || row.description || '',
            introduction: seed?.introduction || row.description || '',
            selectionCriteria: seed?.selectionCriteria || [
              'Must have undergone hands-on editorial vetting',
              'Must prioritize daily durability and utility',
              'Direct merchant fulfillment with verified warranties'
            ],
            productIds: rawProductIds,
            bookIds: seed?.bookIds || [],
            banner_image_url: bannerImg,
            bannerImageUrl: bannerImg,
            image_url: imgUrl || resolvedCover,
            imageUrl: imgUrl || resolvedCover,
            coverImage: resolvedCover,
            cover_image: resolvedCover,
            products: resolvedProducts,
            lastReviewedAt: row.last_reviewed_at || row.created_at || new Date().toISOString(),
            status: row.is_active === false ? 'draft' : ((row.status as Collection['status']) || 'published'),
            activeProductCount: activeIds.length
          };
        }
      } catch (err) {
        console.error('[CatalogRepository] getCollectionBySlug Supabase error:', err);
      }
    } else {
      const found = this.collections.find(c => c.slug === slug || (slug === 'halloween-house-family-kit' && c.slug === 'halloween-house-and-family-kit')) 
        || INITIAL_COLLECTIONS.find(c => c.slug === slug || (slug === 'halloween-house-family-kit' && c.slug === 'halloween-house-and-family-kit'));
      if (found) {
        const activeProds = (found.productIds || []).map(pId => {
          return this.products.find(prod => (prod.id === pId || prod.slug === pId) && prod.status === 'active');
        }).filter((p): p is NonNullable<typeof p> => Boolean(p));

        const firstProductImage = activeProds[0]?.imageUrl;
        const bannerImg = (found as any).banner_image_url || (found as any).bannerImageUrl || null;
        const imgUrl = (found as any).image_url || (found as any).imageUrl || null;
        const coverImgRaw = (found as any).cover_image || found.coverImage || null;

        const resolvedProds = activeProds.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.name,
          image_url: p.imageUrl,
          imageUrl: p.imageUrl
        }));

        const resolvedCover = getCollectionBannerImage(
          {
            ...found,
            banner_image_url: bannerImg,
            image_url: imgUrl || coverImgRaw,
            products: resolvedProds
          },
          firstProductImage
        );

        col = {
          ...found,
          banner_image_url: bannerImg,
          bannerImageUrl: bannerImg,
          image_url: imgUrl || resolvedCover,
          imageUrl: imgUrl || resolvedCover,
          coverImage: resolvedCover,
          cover_image: resolvedCover,
          products: resolvedProds,
          activeProductCount: activeProds.length
        };
      }
    }

    if (!col) return undefined;
    if (options?.storefrontOnly) {
      if (col.status !== 'published' || (col.activeProductCount ?? 0) <= 0) {
        return undefined;
      }
    }
    return col;
  }

  public async getAllCollections(options?: { storefrontOnly?: boolean }): Promise<Collection[]> {
    let result: Collection[] = [];

    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const [colsRes, activeProdsRes] = await Promise.all([
          supabase.from('collections').select('*'),
          supabase.from(TABLE_PRODUCTS).select('id, slug, title, image_url, status').eq('status', 'active')
        ]);

        const activeProds = activeProdsRes.data || [];
        const activeProdsMap = new Map(activeProds.map(p => [p.id, p]));

        if (!colsRes.error && colsRes.data && colsRes.data.length > 0) {
          result = colsRes.data.map(row => {
            const seed = INITIAL_COLLECTIONS.find(c => c.slug === row.slug || c.id === row.id);
            const rawProductIds: string[] = Array.isArray(row.product_ids) ? row.product_ids : (seed?.productIds || []);
            const matchingProducts = rawProductIds
              .map(id => activeProdsMap.get(id))
              .filter(Boolean) as typeof activeProds;
            const validActiveCount = matchingProducts.length;
            const firstProductImage = matchingProducts[0]?.image_url;

            const bannerImg = (row.banner_image_url as string) || (seed as any)?.banner_image_url || (seed as any)?.bannerImageUrl || null;
            const imgUrl = (row.image_url as string) || (seed as any)?.image_url || (seed as any)?.imageUrl || null;
            const coverImgRaw = (row.cover_image as string) || seed?.coverImage || null;

            const resolvedProducts = matchingProducts.map(p => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              image_url: p.image_url,
              imageUrl: p.image_url
            }));

            const resolvedCover = getCollectionBannerImage(
              {
                banner_image_url: bannerImg,
                image_url: imgUrl || coverImgRaw,
                products: resolvedProducts
              },
              firstProductImage
            );

            return {
              id: row.id,
              slug: row.slug,
              title: row.title,
              subtitle: seed?.subtitle || row.description || '',
              introduction: seed?.introduction || row.description || '',
              description: row.description || seed?.description,
              selectionCriteria: seed?.selectionCriteria || [
                'Must have undergone hands-on editorial vetting',
                'Must prioritize daily durability and utility',
                'Direct merchant fulfillment with verified warranties'
              ],
              productIds: rawProductIds,
              bookIds: seed?.bookIds || [],
              banner_image_url: bannerImg,
              bannerImageUrl: bannerImg,
              image_url: imgUrl || resolvedCover,
              imageUrl: imgUrl || resolvedCover,
              coverImage: resolvedCover,
              cover_image: resolvedCover,
              products: resolvedProducts,
              lastReviewedAt: row.last_reviewed_at || row.created_at || new Date().toISOString(),
              status: row.is_active === false ? 'draft' : ((row.status as Collection['status']) || 'published'),
              activeProductCount: validActiveCount
            };
          });
        }
      } catch (err) {
        console.error('[CatalogRepository] getAllCollections Supabase error:', err);
      }
    }

    if (result.length === 0) {
      const baseCollections = this.collections.length > 0 ? this.collections : INITIAL_COLLECTIONS;
      const activeProds = this.products.filter(p => p.status === 'active');
      const activeMap = new Map(activeProds.map(p => [p.id, p]));
      result = baseCollections.map(c => {
        const matching = (c.productIds || []).map(id => activeMap.get(id)).filter(Boolean) as typeof activeProds;
        const firstProductImage = matching[0]?.imageUrl;
        const bannerImg = (c as any).banner_image_url || (c as any).bannerImageUrl || null;
        const imgUrl = (c as any).image_url || (c as any).imageUrl || null;
        const coverImgRaw = (c as any).cover_image || c.coverImage || null;

        const resolvedProds = matching.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.name,
          image_url: p.imageUrl,
          imageUrl: p.imageUrl
        }));

        const resolvedCover = getCollectionBannerImage(
          {
            ...c,
            banner_image_url: bannerImg,
            image_url: imgUrl || coverImgRaw,
            products: resolvedProds
          },
          firstProductImage
        );

        return {
          ...c,
          banner_image_url: bannerImg,
          bannerImageUrl: bannerImg,
          image_url: imgUrl || resolvedCover,
          imageUrl: imgUrl || resolvedCover,
          coverImage: resolvedCover,
          cover_image: resolvedCover,
          products: resolvedProds,
          activeProductCount: matching.length
        };
      });
    }

    if (options?.storefrontOnly) {
      result = result.filter(c => c.status === 'published' && (c.activeProductCount ?? 0) > 0);
    }

    return result;
  }

  public async createCollection(input: {
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    bannerImageUrl?: string;
    banner_image_url?: string;
    imageUrl?: string;
    image_url?: string;
    productIds?: string[];
    status?: 'published' | 'draft';
  }): Promise<{ success: boolean; collection?: Collection; error?: string }> {
    const cleanSlug = input.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = `col-${Date.now()}`;
    const now = new Date().toISOString();
    const productIds = Array.isArray(input.productIds) ? Array.from(new Set(input.productIds)) : [];
    const status = input.status || 'published';
    const desc = input.description || '';

    const bannerImage = input.bannerImageUrl || input.banner_image_url || undefined;
    const itemImage = input.imageUrl || input.image_url || input.coverImage || undefined;

    // Dynamic resolution for cover image
    let coverImage = bannerImage || itemImage;
    if (!coverImage || coverImage.includes('photo-1518455027359-f3f8164ba6bd') || coverImage.includes('/desk.jpg') || coverImage.includes('placeholder')) {
      if (productIds.length > 0) {
        const firstProd = await this.getProductById(productIds[0]);
        if (firstProd?.imageUrl) {
          coverImage = firstProd.imageUrl;
        }
      }
    }
    if (!coverImage) {
      coverImage = '/placeholder-bundle.png';
    }

    const newCol: Collection = {
      id: newId,
      slug: cleanSlug,
      title: input.title,
      subtitle: desc,
      introduction: desc,
      selectionCriteria: [
        'Must have undergone hands-on editorial vetting',
        'Must prioritize daily durability and utility',
        'Direct merchant fulfillment with verified warranties'
      ],
      productIds,
      bookIds: [],
      banner_image_url: bannerImage || null,
      bannerImageUrl: bannerImage || null,
      image_url: itemImage || coverImage,
      imageUrl: itemImage || coverImage,
      coverImage,
      cover_image: coverImage,
      lastReviewedAt: now,
      status
    };

    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const row: Record<string, unknown> = {
          id: newId,
          slug: cleanSlug,
          title: input.title,
          description: desc,
          product_ids: productIds,
          cover_image: coverImage,
          banner_image_url: bannerImage || null,
          image_url: itemImage || null,
          last_reviewed_at: now,
          status,
          created_at: now
        };

        let { error: sbError } = await supabase.from('collections').insert(row);
        if (sbError && (sbError.code === 'PGRST204' || sbError.message.includes('banner_image_url') || sbError.message.includes('image_url') || sbError.message.includes('cover_image'))) {
          delete row.banner_image_url;
          delete row.image_url;
          delete row.cover_image;
          const retry = await supabase.from('collections').insert(row);
          sbError = retry.error;
        }

        if (sbError) {
          console.error('[CatalogRepository] Supabase createCollection error:', sbError);
          return { success: false, error: sbError.message };
        }

        // Try inserting into collection_products if table exists
        if (productIds.length > 0) {
          try {
            const joinRows = productIds.map((pId, idx) => ({
              collection_id: newId,
              product_id: pId,
              sort_order: idx
            }));
            await supabase.from('collection_products').insert(joinRows);
          } catch {
            // ignore if join table does not exist
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Database error';
        console.error('[CatalogRepository] Supabase createCollection exception:', err);
        return { success: false, error: message };
      }
    }

    this.collections.unshift(newCol);
    return { success: true, collection: newCol };
  }

  public async updateCollection(
    idOrSlug: string,
    input: Partial<{
      title: string;
      slug: string;
      description: string;
      coverImage: string;
      bannerImageUrl: string;
      banner_image_url: string;
      imageUrl: string;
      image_url: string;
      productIds: string[];
      status: 'published' | 'draft';
    }>
  ): Promise<{ success: boolean; collection?: Collection; error?: string }> {
    const existing = await this.getCollectionBySlug(idOrSlug) || this.collections.find(c => c.id === idOrSlug);
    if (!existing) {
      return { success: false, error: 'Collection not found' };
    }

    const now = new Date().toISOString();
    if (input.title) existing.title = input.title;
    if (input.slug) existing.slug = input.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '');
    if (input.description !== undefined) {
      existing.subtitle = input.description;
      existing.introduction = input.description;
    }
    if (input.productIds) existing.productIds = Array.from(new Set(input.productIds));

    const bannerImage = input.bannerImageUrl || input.banner_image_url;
    if (bannerImage !== undefined) {
      existing.banner_image_url = bannerImage || null;
      existing.bannerImageUrl = bannerImage || null;
    }

    const imageUrl = input.imageUrl || input.image_url;
    if (imageUrl !== undefined) {
      existing.image_url = imageUrl || null;
      existing.imageUrl = imageUrl || null;
    }

    if (input.coverImage) {
      existing.coverImage = input.coverImage;
      existing.cover_image = input.coverImage;
    } else if (bannerImage) {
      existing.coverImage = bannerImage;
      existing.cover_image = bannerImage;
    } else if (input.productIds && input.productIds.length > 0) {
      const isCurrentDeskOrPlaceholder = !existing.coverImage || existing.coverImage.includes('photo-1518455027359-f3f8164ba6bd') || existing.coverImage.includes('/desk.jpg') || existing.coverImage.includes('placeholder');
      if (isCurrentDeskOrPlaceholder) {
        const firstProd = await this.getProductById(input.productIds[0]);
        if (firstProd?.imageUrl) {
          existing.coverImage = firstProd.imageUrl;
          existing.cover_image = firstProd.imageUrl;
        }
      }
    }
    if (input.status) existing.status = input.status;
    existing.lastReviewedAt = now;

    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const updateRow: Record<string, unknown> = {
          title: existing.title,
          slug: existing.slug,
          description: existing.introduction,
          product_ids: existing.productIds,
          cover_image: existing.coverImage,
          banner_image_url: existing.banner_image_url || null,
          image_url: existing.image_url || null,
          last_reviewed_at: now,
          status: existing.status
        };

        let { error: sbError } = await supabase
          .from('collections')
          .update(updateRow)
          .eq('id', existing.id);

        if (sbError && (sbError.code === 'PGRST204' || sbError.message.includes('banner_image_url') || sbError.message.includes('image_url') || sbError.message.includes('cover_image'))) {
          delete updateRow.banner_image_url;
          delete updateRow.image_url;
          delete updateRow.cover_image;
          const retry = await supabase
            .from('collections')
            .update(updateRow)
            .eq('id', existing.id);
          sbError = retry.error;
        }

        if (sbError) {
          console.error('[CatalogRepository] Supabase updateCollection error:', sbError);
          return { success: false, error: sbError.message };
        }

        // Try syncing collection_products join table if exists
        try {
          await supabase.from('collection_products').delete().eq('collection_id', existing.id);
          if (existing.productIds.length > 0) {
            const joinRows = existing.productIds.map((pId, idx) => ({
              collection_id: existing.id,
              product_id: pId,
              sort_order: idx
            }));
            await supabase.from('collection_products').insert(joinRows);
          }
        } catch {
          // ignore if join table does not exist
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Database error';
        console.error('[CatalogRepository] Supabase updateCollection exception:', err);
        return { success: false, error: message };
      }
    }

    const memIdx = this.collections.findIndex(c => c.id === existing.id);
    if (memIdx >= 0) this.collections[memIdx] = existing;
    else this.collections.push(existing);

    return { success: true, collection: existing };
  }

  public async deleteCollection(idOrSlug: string): Promise<boolean> {
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        try {
          await supabase.from('collection_products').delete().eq('collection_id', idOrSlug);
        } catch {}

        const { error: err1 } = await supabase.from('collections').delete().eq('id', idOrSlug);
        if (err1) {
          await supabase.from('collections').delete().eq('slug', idOrSlug);
        }
      } catch (err) {
        console.error('[CatalogRepository] Supabase deleteCollection error:', err);
      }
    }

    const idx = this.collections.findIndex(c => c.id === idOrSlug || c.slug === idOrSlug);
    if (idx >= 0) {
      this.collections.splice(idx, 1);
    }
    return true;
  }

  public async cleanupOrphanedBundleProducts(): Promise<{ cleanedCount: number; message: string }> {
    let cleaned = 0;
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const { data: prods } = await supabase.from(TABLE_PRODUCTS).select('id');
        const prodIdSet = new Set((prods || []).map(p => p.id));

        // 1. Delete orphaned rows from collection_products join table if present
        try {
          const { data: cpRows } = await supabase.from('collection_products').select('collection_id, product_id');
          if (Array.isArray(cpRows)) {
            const orphaned = cpRows.filter(r => !prodIdSet.has(r.product_id));
            for (const row of orphaned) {
              await supabase.from('collection_products').delete().eq('collection_id', row.collection_id).eq('product_id', row.product_id);
              cleaned++;
            }
          }
        } catch {
          // ignore if table doesn't exist
        }

        // 2. Clean up collections product_ids JSONB array
        try {
          const { data: cols } = await supabase.from('collections').select('id, product_ids');
          if (Array.isArray(cols)) {
            for (const col of cols) {
              const rawIds: string[] = Array.isArray(col.product_ids) ? col.product_ids : [];
              const validIds = rawIds.filter(id => prodIdSet.has(id));
              if (validIds.length !== rawIds.length) {
                await supabase.from('collections').update({ product_ids: validIds }).eq('id', col.id);
                cleaned += (rawIds.length - validIds.length);
              }
            }
          }
        } catch {}

        return { cleanedCount: cleaned, message: `Cleaned ${cleaned} orphaned product link(s).` };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Database error';
        return { cleanedCount: 0, message: msg };
      }
    }
    return { cleanedCount: 0, message: 'In-memory mode: all product links valid.' };
  }

  public async manageBundleProducts(
    bundleSlug: string,
    action: 'add' | 'remove',
    productSlugs: string[]
  ): Promise<{ success: boolean; collection?: Collection; error?: string }> {
    const col = await this.getCollectionBySlug(bundleSlug);
    if (!col) {
      return { success: false, error: `Bundle with slug "${bundleSlug}" not found` };
    }

    const allProducts = await this.getAllProducts();
    const targetProductIds: string[] = [];
    for (const pSlug of productSlugs) {
      const p = allProducts.find(prod => prod.slug === pSlug || prod.id === pSlug);
      if (p) targetProductIds.push(p.id);
    }

    if (targetProductIds.length === 0) {
      return { success: false, error: 'None of the specified product slugs were found in the catalog' };
    }

    let updatedIds = [...col.productIds];
    if (action === 'add') {
      updatedIds = Array.from(new Set([...updatedIds, ...targetProductIds]));
    } else if (action === 'remove') {
      const removeSet = new Set(targetProductIds);
      updatedIds = updatedIds.filter(id => !removeSet.has(id));
    }

    return this.updateCollection(col.id, { productIds: updatedIds });
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
  public async getAllProductsForMcp(filter?: { status?: string; category?: string }) {
    const products = await this.getAllProducts(filter);
    return products.map(p => {
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

  public async getStoreMcpStats() {
    let products_by_status = {
      draft: 0,
      active: 0,
      paused: 0,
      archived: 0
    };

    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase.from(TABLE_PRODUCTS).select('status');
        if (!error && data) {
          for (const row of data) {
            const status = row.status as keyof typeof products_by_status;
            if (products_by_status[status] !== undefined) {
              products_by_status[status]++;
            }
          }
        }
      } catch (err) {
        console.error('[CatalogRepository] getStoreMcpStats Supabase error:', err);
      }
    } else {
      products_by_status = {
        draft: this.products.filter(p => p.status === 'draft').length,
        active: this.products.filter(p => p.status === 'active').length,
        paused: this.products.filter(p => p.status === 'paused').length,
        archived: this.products.filter(p => p.status === 'archived').length
      };
    }

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

  public async getStoreStats() {
    return this.getStoreMcpStats();
  }

  public getTelemetry(days: number = 7) {
    return this.getClicksReport(days);
  }

  // --- SEASONAL THEME & SITE SETTINGS ---
  public async getSeasonalTheme(): Promise<{ active: boolean; theme: string }> {
    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        // 1. Primary: query site_settings table
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'seasonal_theme')
          .maybeSingle();

        if (!error && data && data.value) {
          const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          this.seasonalTheme = {
            active: Boolean(val.active),
            theme: String(val.theme || 'halloween')
          };
          if (typeof global !== 'undefined') {
            (global as any).__seasonalTheme = this.seasonalTheme;
          }
          return this.seasonalTheme;
        }

        // 2. Fallback: if site_settings table is pending migration (PGRST205), check persistent collections setting row
        if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
          const { data: fallbackRow } = await supabase
            .from('collections')
            .select('description')
            .eq('id', 'site_setting_seasonal_theme')
            .maybeSingle();

          if (fallbackRow && fallbackRow.description) {
            try {
              const val = JSON.parse(fallbackRow.description);
              this.seasonalTheme = {
                active: Boolean(val.active),
                theme: String(val.theme || 'halloween')
              };
              if (typeof global !== 'undefined') {
                (global as any).__seasonalTheme = this.seasonalTheme;
              }
              return this.seasonalTheme;
            } catch {}
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[CatalogRepository] getSeasonalTheme Supabase error, falling back to memory:', err);
        }
      }
    }
    if (typeof global !== 'undefined' && (global as any).__seasonalTheme) {
      return (global as any).__seasonalTheme;
    }
    return this.seasonalTheme;
  }

  public async setSeasonalTheme(active: boolean, theme: string = 'halloween'): Promise<{ active: boolean; theme: string }> {
    this.seasonalTheme = { active, theme };
    if (typeof global !== 'undefined') {
      (global as any).__seasonalTheme = { active, theme };
    }

    if (this.getBackendMode().mode === 'supabase') {
      try {
        const supabase = getSupabaseAdminClient();
        // 1. Primary: update site_settings table
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: 'seasonal_theme',
            value: { active, theme },
            updated_at: new Date().toISOString()
          });

        // 2. Fallback: if site_settings table pending migration (PGRST205), sync to persistent collections row
        if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
          await supabase
            .from('collections')
            .upsert({
              id: 'site_setting_seasonal_theme',
              slug: '__site_setting_seasonal_theme',
              title: 'site_setting_seasonal_theme',
              description: JSON.stringify({ active, theme }),
              status: 'draft'
            });
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[CatalogRepository] setSeasonalTheme exception:', err);
        }
      }
    }

    return this.seasonalTheme;
  }
}

// Global Singleton to preserve repository mutations across Hot Reloads & Server Actions
const globalForRepo = global as unknown as { catalogRepository: CatalogRepository; __seasonalTheme?: { active: boolean; theme: string } };
export const catalogRepository = globalForRepo.catalogRepository || new CatalogRepository();
if (globalForRepo.catalogRepository && typeof (globalForRepo.catalogRepository as any).seedOffers !== 'function') {
  Object.setPrototypeOf(globalForRepo.catalogRepository, CatalogRepository.prototype);
}
globalForRepo.catalogRepository = catalogRepository;
