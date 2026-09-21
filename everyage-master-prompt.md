# MASTER BUILD PROMPT — EveryAge Digital
## Next.js Affiliate Storefront + /admin Control Center (Minimal-Admin-First, Option A)

You are a principal product designer, ecommerce UX architect, affiliate-commerce engineer,
AI shopping assistant engineer, SEO strategist, data architect, and QA engineer.

Build a production-quality affiliate commerce storefront named **EveryAge Digital** with an
integrated private **/admin control center** from day 1.

This is NOT an AI-tools directory. This is NOT a generic blog. This is NOT a normal ecommerce
store with physical inventory. This is a **curated affiliate shopping marketplace and
digital-product store** with an admin dashboard for the owner.

Visitors browse/compare products but buy on the external merchant site through compliant
affiliate links. The site may earn commission from Amazon Associates, Gumroad, ClickBank,
Impact, CJ, Awin, ShareASale, PartnerStack, direct brand programs. The owner sells own
digital products via a merchant-of-record (Lemon Squeezy / Paddle) or demo checkout.

---

## 0. NON-NEGOTIABLE BUILD ORDER (follow strictly)

Phase 1 — Foundation:      Next.js App Router + TS + Tailwind + ESLint strict + Vitest
Phase 2 — Data layer:      Supabase/Postgres schema + typed repository + Zod validation
Phase 3 — Storefront core: / , /shop , /product/[slug] , /category/[slug] , /search
Phase 4 — ADMIN CORE:      /admin (auth + Products CRUD + Links + Click stats)  ← from day 1
Phase 5 — Commerce extras: /compare , /deals , /books , /collection/[slug] , /wishlist
Phase 6 — AI assistant:    /assistant (Sage) grounded strictly in catalog
Phase 7 — Trust & legal:   /about , /methodology , /affiliate-disclosure , /privacy , /terms , /contact
Phase 8 — Own products:    /shop/own-products + payment abstraction + demo checkout
Phase 9 — QA:              unit tests for repos/actions, link compliance test, a11y pass, Lighthouse ≥ 90

Do NOT skip to Phase 5+ before Phase 4 exists. The owner must be able to add products
via /admin before the site gets more features.

---

## 1. TECH STACK (fixed)
- Next.js App Router, TypeScript (strict), Tailwind CSS
- Lucide icons, accessible headless UI primitives
- PostgreSQL via Supabase (schemas + typed query adapters / repository layer)
- Zod validation on ALL inputs (forms, server actions, API routes)
- Server actions + API routes
- Search adapter interface (Postgres full-text now; Meilisearch/Typesense later)
- Vitest unit tests; ESLint

## 2. DATABASE SCHEMA (implement exactly these core tables)
- products: id, slug, title, description, category_id, merchant_id, price_min, price_max,
  currency, image_url, status (draft|active|paused|archived), is_owned (bool),
  rating_display, created_at, updated_at
- merchants: id, slug, name, network (amazon|gumroad|clickbank|impact|cj|awin|shareasale|partnerstack|direct|owned), base_url
- affiliate_links: id, product_id, network, url, rel_tag ("sponsored nofollow noopener"),
  lastCheckedAt, staleAfter (days), click_count
- categories: id, slug, name, parent_id, sort_order
- collections: id, slug, title, description, product_ids[] (or join table)
- clicks: id, link_id, product_id, ts, referrer, country
- assistant_logs: id, ts, session_id, user_message, assistant_reply, products_referenced[]
- own_products: extends products with price, delivery_info, refund_policy, checkout_provider (lemonsqueezy|paddle|demo), checkout_url
- admin_users: id, email, password_hash (or Supabase Auth), role

## 3. /admin CONTROL CENTER (Phase 4 — build minimal but real)

### 3.1 Auth
- Supabase Auth (email+password), single owner role
- /admin redirects to /admin/login when unauthenticated; middleware protects ALL /admin/* routes
- No public signups

### 3.2 Layout
- Sidebar: Dashboard | Products | Affiliate Links | Categories | Own Products | Assistant Logs | Settings
- Top bar: search products, "Add Product" primary button
- Same brand tokens as storefront but denser (admin = utility)

### 3.3 Dashboard page (/admin)
- Cards: total active products, clicks last 7d, clicks last 30d, top product
- Table: top 10 products by clicks (7d) with sparkline
- Stale-price list: products where lastCheckedAt + staleAfter < now → "Check price" badge
- Assistant: conversations count this week, last 5 questions

### 3.4 Products CRUD (/admin/products) — THE CORE
- Table: image thumb, title, category, merchant/network, price, status, clicks, updated_at
- Filters: status, category, merchant, stale-price
- Add/Edit form fields:
  title*, slug (auto from title, editable), description*, category*, merchant*,
  price_min, price_max, currency (default USD), image upload (to Supabase storage),
  affiliate_url* (validated per network format), status toggle,
  SEO: meta_title, meta_description
- Zod validates ALL fields; slug uniqueness enforced
- Actions: Save draft / Activate / Pause / Archive / Delete (soft)
- After save → product live on /shop immediately (revalidatePath)

### 3.5 Affiliate Links page (/admin/links)
- List: product, network, URL (masked display), clicks, lastCheckedAt, stale badge
- Bulk action: "Mark price as checked" (updates lastCheckedAt)
- Compliance view: every link renders rel="sponsored nofollow noopener" (test exists)

### 3.6 Categories (/admin/categories)
- CRUD, drag sort_order, show product count per category

### 3.7 Own Products (/admin/own-products)
- Same CRUD + checkout_provider select (demo default) + delivery info + refund policy fields
- Demo checkout flag shows site-wide banner "Demo checkout — not connected to a real payment provider."

### 3.8 Assistant logs (/admin/assistant)
- Table of conversations; flag any assistant reply referencing products NOT in catalog (hallucination alarm)

## 4. OWNER WORKFLOW (must work end-to-end — test in QA)
"Add a new product in under 2 minutes without code":
1. /admin/products → Add Product
2. Fill title/description/category/merchant/price, paste affiliate URL, upload image
3. Save as Active → appears on /shop and /category/[slug] instantly
4. Click on storefront link → click_count +1 → visible on /admin dashboard
Write a Vitest test proving this flow at the data layer.

## 5. PRODUCT DEFINITION
Promise: "Discover useful products, books, digital resources, and everyday essentials —
curated clearly and recommended intelligently."
- Affiliate products: info, approved imagery, merchant, price status, availability status;
  purchase happens on merchant site via compliant affiliate URL; clear disclosures everywhere
- Owned products: product page, price, checkout, delivery info, refund policy

## 6. TARGET USERS
Students, freelancers, creators, remote workers, small online-business owners, everyday
shoppers. International accessibility: currency display + regional offer support.

## 7. BRAND & VISUAL DIRECTION (storefront; admin may be denser but same family)
--background:#F7F7F4; --surface:#FFFFFF; --surface-muted:#F0F1ED; --text:#151515;
--text-secondary:#667085; --border:#E4E7EC; --accent:#234F9E; --accent-hover:#193B7A;
--success:#18794E; --warning:#A15C00; --danger:#B42318; --featured:#F2EBDD
Editorial commerce design: calm, trustworthy, selective, useful.
NO neon purple AI vibes, NO fake reviews, NO fake metrics.

## 8. REQUIRED ROUTES
Storefront:
- /                      Homepage & featured storefront
- /shop                  Main marketplace (filters & sort)
- /search                Search results
- /category/[slug]       Category page
- /merchant/[slug]       Merchant page
- /product/[slug]        Product detail + recommendations
- /collection/[slug]     Curated collection
- /books                 Books, PDFs, guides
- /books/[slug]          Book detail
- /deals                 Deals & price-sensitive picks
- /compare               Comparison builder
- /compare/[slug]        Shareable comparison
- /assistant             AI shopping receptionist (Sage)
- /wishlist , /my-list   Saved items
- /shop/own-products     Owner digital products
- /shop/own-products/[slug]
- /about , /methodology , /affiliate-disclosure , /privacy , /terms , /contact
Admin:
- /admin                 Dashboard
- /admin/login
- /admin/products        (+ /new , /[id]/edit)
- /admin/links
- /admin/categories
- /admin/own-products
- /admin/assistant
- /admin/settings

## 9. AI SHOPPING RECEPTIONIST (Sage) — Phase 6
- Polite digital shopping receptionist
- Guided inquiry: budget → use case → physical vs digital → preferred merchant → region
- Retrieval strictly grounded in stored catalog via tools:
  searchCatalog(query), filterByBudget(max), filterByCategory(cat), getByMerchant(m)
- Transparent reasons: "Matches your budget", "Sold by your preferred merchant"
- NEVER hallucinates prices, reviews, or uncataloged items — if not in catalog, says so
- All conversations logged to assistant_logs for /admin/assistant

## 10. AFFILIATE INTEGRATION & COMPLIANCE
- Adapter architecture: AmazonProvider, GumroadProvider, ImpactProvider, DirectProvider, OwnedProvider
  (interface: validateUrl(url), formatLink(url), checkPrice() placeholder)
- All outbound links: rel="sponsored nofollow noopener"
- Amazon pages must show exact text: "As an Amazon Associate I earn from qualifying purchases."
- General affiliate disclosure near ALL CTA buttons
- Price freshness: lastCheckedAt + staleAfter → show "Check current price" instead of hard price
- Click tracking via internal redirect (/api/go/[linkId]) that 302s to merchant (counts click)

## 11. OWNED DIGITAL PRODUCTS & CHECKOUT
- Payment provider abstraction interface: createCheckout(product, buyer) → url
- Implementers: LemonSqueezyProvider, PaddleProvider, DemoProvider (default)
- Demo mode shows modal: "Demo checkout — not connected to a real payment provider."
- Delivery info + refund policy rendered on own-product pages

## 12. SEO
- metadata API per route, canonical URLs, OpenGraph images
- JSON-LD: Product (with price if owned; no fake ratings for affiliate), Article for collections
- /methodology explains selection criteria (no fake metrics)

## 13. QA / ACCEPTANCE (do not call done without these)
- [ ] Vitest: repository CRUD, Zod schemas reject bad affiliate URLs, slug uniqueness
- [ ] Click redirect flow test: /api/go/[id] increments clicks then 302
- [ ] Compliance test: every rendered affiliate anchor contains rel="sponsored nofollow noopener"
- [ ] Auth test: /admin/* unauthenticated → redirect to /admin/login
- [ ] Owner workflow test (section 4)
- [ ] a11y: keyboard nav on admin forms + storefront filters; Lighthouse ≥ 90 perf & a11y
- [ ] No fake reviews/metrics anywhere (grep test)

## 14. SEED DATA
Seed 12 demo products across 4 categories (2 owned digital products incl. one demo-checkout),
3 merchants (amazon, gumroad, direct), 2 collections. Realistic copy, no lorem ipsum.

## 15. DELIVERABLES
- Complete repo, runnable with `npm run dev` after env setup (.env.example documented)
- README: setup, Supabase migration steps, how to create the first admin user,
  how to switch DemoProvider → LemonSqueezy later
- All phases committed in order with clear commit messages
