# EveryAge Digital — Comprehensive Project Architecture & Specification

> **Live Production Storefront:** [https://www.everyagedigital.store](https://www.everyagedigital.store)  
> **Repository:** `everyagedigital2`  
> **Status:** Production-Ready & Deployed  
> **Last Updated:** September 2026

---

## 1. Executive Summary & Brand Identity

**EveryAge Digital** is a production-grade, editorial-driven affiliate commerce publication and digital resource marketplace. Unlike generic affiliate spam blogs, drop-shipping websites, or unstructured AI tool directories, EveryAge Digital is modeled after high-end industrial design and architecture publications (e.g., *Monocle*, *Hodinkee*, *The Wirecutter*). Its core editorial thesis is:

> *"Objects and texts worth owning, testing, and keeping."*

The platform bridges curated physical hardware (desktop ergonomics, workspace illumination, mechanical peripherals, audio monitors) with foundational digital assets (systems architecture templates, Notion operating workspaces, commercial guides). 

### Core Differentiators
1. **Opinionated Editorial Stance**: Every specimen card presents a dual evaluation: **"The Sweet Spot"** (its standout utility and ergonomic strength) alongside **"The Catch"** (clear, unvarnished trade-offs detailing who should *not* buy it).
2. **Absolute Brand & Regulatory Trust**: Fully compliant with Federal Trade Commission (FTC) guidelines and Google Search quality standards. All outbound merchant links enforce `rel="sponsored nofollow noopener"` via an audited link redirection pipeline (`/api/go/[id]`).
3. **Dynamic Price Freshness Guardrails**: If merchant pricing data is stale or unverified, the interface prompts the reader to check current live pricing rather than displaying deceptive or expired discount figures.
4. **Deterministic Shopping Concierge**: An AI-powered concierge grounded strictly in the vetted repository catalog, mathematically barred from hallucinating uncataloged products or fabricating ratings.

---

## 2. Technical Stack & Dependencies

The application is built on modern web primitives designed for sub-second page loads, zero runtime layout shifts, and search engine discoverability.

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js (App Router)](https://nextjs.org) | `16.3.5` | Turbopack compilation, React Server Components (RSC), Dynamic Route Generation, Edge Middleware |
| **Runtime & UI** | [React](https://react.dev) | `19.2.8` | Component rendering, concurrent transitions, hooks |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | `v4.0.0` | Zero-runtime CSS variables, responsive typography, custom magazine design tokens |
| **Icons** | [Lucide React](https://lucide.dev) | `^1.47.0` | Minimal, high-precision SVG icons |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) | `^0.4.6` | Flawless dark/light mode switching without hydration flicker |
| **Schema Validation** | [Zod](https://zod.dev) | `^4.6.5` | Runtime DTO validation for catalog records, offers, filters, and admin forms |
| **Database** | [Supabase / PostgreSQL](https://supabase.com) | `^2.117.0` | Relational tables, affiliate links, click logs, site settings |
| **Unit Testing** | [Vitest](https://vitest.dev) | `^5.0.1` | Fast test runner for catalog search algorithms, mappers, and adapters |
| **E2E Testing** | [Playwright](https://playwright.dev) | `^1.63.0` | Browser testing for checkout flows, search filters, and mobile drawer responsiveness |
| **Deployment** | [Vercel](https://vercel.com) | `Production` | Serverless deployment, Edge CDN, image optimization, instant SSL |

---

## 3. Visual System & Typography Design Tokens

The visual language rejects generic tech aesthetics in favor of a timeless editorial magazine layout.

### Color Palette
- **Light Theme**:
  - Page Background: `#f4f3ef` (warm editorial newsprint)
  - Card Surfaces: `#faf9f6` (linen white) with subtle borders (`border-neutral-200/80`)
  - Typography: Pure high-contrast `#111827` (charcoal black) for headings; `#4b5563` for descriptive prose
  - Eyebrows & Badges: `#374151` (`text-neutral-700`) for high-contrast legibility
- **Dark Theme**:
  - Page Background: `#070a0e` (rich obsidian)
  - Card Surfaces: `#0d1117` with hairline architectural borders (`border-neutral-800`)
  - Typography: `#ffffff` for titles; `#9ca3af` (`text-neutral-400`) for body
  - Accent Badges: Emerald (`#10b981`) for "The Sweet Spot", Amber (`#f59e0b`) for "The Catch", Royal Blue (`#2563eb`) for CTAs

### Typography
- **Headings**: `Newsreader` (Google Fonts variable serif) with subtle italicized pull-quotes.
- **Body Text**: `Geist Sans` for clean, dense editorial explanations.
- **Data, Specs & Eyebrows**: `Geist Mono` in uppercase tracking (`tracking-wider`, `text-[10px]` to `text-xs`) to emphasize laboratory-tested precision.

---

## 4. Complete Application Route Map

```
src/app/
├── layout.tsx                     # Root HTML shell, Geist & Newsreader font loading, ThemeProvider, WishlistProvider
├── globals.css                    # Tailwind v4 theme directives, button & card utilities, scrollbar styling
├── page.tsx                       # Homepage (Hero, Issue Spotlight, Collections, Direct Products, Trust Pillars, Dispatch)
├── sitemap.ts                     # Dynamic XML sitemap generator (products, collections, categories, static URLs)
├── robots.ts                      # Dynamic robots.txt with disallow directives for /admin and /api/
├── shop/
│   ├── page.tsx                   # Full catalog marketplace with multi-facet filters & sorting
│   └── own-products/
│       ├── page.tsx               # Direct Publisher Digital Products marketplace
│       └── [slug]/page.tsx        # Digital product sales page with deliverable manifest & checkout
├── product/
│   └── [slug]/page.tsx            # Product Detail Page (canonical URL, JSON-LD, gallery, specs, affiliate CTA)
├── collections/
│   ├── page.tsx                   # Curated Collections index (responsive 2-column or 3-column grid)
│   └── [slug]/page.tsx            # Collection Kit brief (specimen breakdown, bundle pricing, collective checkout)
├── books/
│   ├── page.tsx                   # Essential Texts index (deep work, strategy, habit literature)
│   └── [slug]/page.tsx            # Book Detail with chapter notes & merchant purchase options
├── assistant/
│   └── page.tsx                   # Deterministic Catalog Concierge (receptive search agent UI)
├── deals/
│   └── page.tsx                   # Curated limited-time discounts & promotional affiliate opportunities
├── category/
│   └── [slug]/page.tsx            # Category landing page (e.g., Computer Peripherals, Lighting)
├── merchant/
│   └── [slug]/page.tsx            # Merchant index (Amazon, Gumroad, Direct Brand)
├── compare/
│   └── page.tsx                   # Side-by-side spec comparison table for saved products
├── wishlist/
│   └── page.tsx                   # Client-side bookmarked items (localStorage persisted)
├── methodology/
│   └── page.tsx                   # Vetting standards, test bench equipment, and non-commercial integrity code
├── affiliate-disclosure/
│   └── page.tsx                   # FTC-mandated compensation disclosures and merchant disclosures
├── privacy/
│   └── page.tsx                   # Privacy policy (data minimization, zero tracking cookies)
├── terms/
│   └── page.tsx                   # Legal terms of service
├── contact/
│   └── page.tsx                   # Reader inquiries, hardware submissions, editorial tips
├── admin/
│   ├── layout.tsx                 # Protected admin shell, sidebar navigation, telemetry status
│   ├── page.tsx                   # Executive Dashboard (click analytics, sparklines, stale price alarms)
│   ├── login/page.tsx             # Secure admin credential authentication
│   ├── products/
│   │   ├── page.tsx               # Product management data grid with status toggles
│   │   ├── new/page.tsx           # Product creation form with Zod validation & auto-slug generator
│   │   └── [id]/edit/page.tsx     # Product editor & live preview
│   ├── collections/page.tsx       # Curated Kit bundle editor
│   ├── own-products/page.tsx      # In-house digital resource and checkout provider manager
│   ├── categories/page.tsx        # Category taxonomy hierarchy and sorting weights
│   ├── links/page.tsx             # Affiliate link health monitoring and bulk freshness updater
│   ├── assistant/page.tsx         # AI receptionist conversation audit log with Hallucination Alarms
│   └── settings/page.tsx          # Merchant tag credentials, API keys, seasonal theme switches
└── api/
    ├── go/[id]/route.ts           # Outbound affiliate redirect handler with click logging
    ├── assistant/route.ts         # Concierge search query processor
    ├── contact/route.ts           # Reader dispatch endpoint
    ├── theme/route.ts             # Seasonal ambient theme toggle endpoint
    └── mcp/route.ts               # Model Context Protocol endpoint for external agent pairing
```

---

## 5. Architectural Deep-Dive by Subsystem

### 5.1 The Robust Image Pipeline
Product photography is the foundation of user trust. The platform adheres to strict asset-handling rules:
- **Bidirectional Data Mapping**: The database column is `image_url` (snake_case), while TypeScript uses `imageUrl` (camelCase). [supabaseMapper.ts](src/lib/db/supabaseMapper.ts) safely normalizes and populates *both* keys on every mapped product to eliminate undefined exceptions across server and client components.
- **Zero Blending Artifacts**: Product cards strictly avoid `mix-blend-multiply` or conflicting `block flex` classes. In previous iterations, blending caused white-background Amazon product photos and transparent PNGs to render as murky gray boxes. Studio display frames now use clean backgrounds (`bg-white dark:bg-neutral-900/80`) and `object-contain` scaling.
- **Sanitized Fallbacks**: If an image URL is missing or malformed, the system falls back to the high-resolution direct Amazon CDN image (`https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg`), never returning a broken image icon.
- **Whitelisted Image Hosts**: Configured in [next.config.ts](next.config.ts) for:
  - `m.media-amazon.com` & `images-na.ssl-images-amazon.com` (Amazon Product Advertising CDN)
  - `images.unsplash.com` (Editorial lifestyle references)
  - `raw.githubusercontent.com` & `**.githubusercontent.com` (Open-source assets)
  - `**.supabase.co` (Supabase storage buckets)

### 5.2 Dynamic Catalog Repository (Dual-Mode Architecture)
The data layer in [src/lib/db/repository.ts](src/lib/db/repository.ts) implements an intelligent **dual-mode repository**:
1. **Live Supabase Mode**: Automatically activates when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present in `.env.local`. Fetches active products, affiliate links, and dynamic collections directly from PostgreSQL with realtime synchronization.
2. **In-Memory Fallback Mode**: If database credentials are placeholder or network connectivity is interrupted, the platform seamlessly falls back to the embedded seed catalog ([src/data/seedCatalog.ts](src/data/seedCatalog.ts)). This guarantees zero 500 downtime during maintenance or local testing.

### 5.3 Deterministic Shopping Concierge (`/assistant`)
Unlike generic AI chat wrappers that hallucinate products from external internet memory, EveryAge Digital's concierge operates deterministically:
1. **Extraction**: Analyzes user constraints (budget cap, preferred merchants, room size, physical ergonomics).
2. **Catalog Querying**: Executes structured vector/lexical retrieval exclusively against active records in `catalogRepository`.
3. **Transparent Reasoning**: Explains exactly why a specimen was selected (e.g., *"Fits under your $100 budget limit and provides tactile electromagnetic scrolling"*).
4. **Hallucination Monitoring**: Every interaction is logged to the `/admin/assistant` audit table. If the assistant mentions any brand or SKU not in the database, a red **Hallucination Alarm** is triggered for editorial review.

### 5.4 Affiliate Redirection Engine (`/api/go/[id]`)
Outbound affiliate links are routed through `/api/go/[id]` for tracking, compliance, and URL maintenance:
- Extracts the masked affiliate link ID.
- Increments the `clickCount` and records a timestamped `ClickRecord` in the database (recording device type, referrer, and country).
- Issues an HTTP `302 Found` redirection to the merchant URL with headers:
  ```http
  Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
  X-Robots-Tag: noindex, nofollow
  ```
- All client-side anchor tags enforce:
  ```html
  <a href="..." target="_blank" rel="sponsored nofollow noopener">View Deal &rarr;</a>
  ```

### 5.5 SEO, Metadata & OpenGraph
- **Single-Branded Metadata**: Configured in `src/app/layout.tsx` with `template: '%s | EveryAge Digital'`. Sub-pages output only their title (e.g., `title: product.title`), avoiding repetitive double-branding like `... | EveryAge Digital | EveryAge Digital`.
- **Self-Referential Canonical URLs**: Product and collection detail pages construct precise canonical URLs (`https://www.everyagedigital.store/product/[slug]`), preventing search engines from treating pages as duplicates of the homepage.
- **Automated XML Sitemap**: Generated on the fly at `/sitemap.xml` via [src/app/sitemap.ts](src/app/sitemap.ts), querying all active products and collections from Supabase.
- **Search Engine Directives**: [src/app/robots.ts](src/app/robots.ts) grants public access to product pages while blocking crawlers from `/admin/`, `/api/`, and private endpoints.
- **JSON-LD Schema Markup**: Product pages automatically inject Schema.org `Product` and `Offer` structured data into `<script type="application/ld+json">`, qualifying the catalog for Google Rich Snippets (price badges, in-stock badges, brand tags).

---

## 6. Database Schema & Tables

The production database is orchestrated via Supabase (PostgreSQL). Schema migrations are tracked in `supabase/migrations/001_initial_schema.sql`.

### Core Tables
1. **`products`**:
   - `id` (text, PK): e.g., `prod-2`
   - `slug` (text, unique): URL slug, e.g., `logitech-mx-master-3s`
   - `title` (text): Full product name
   - `description` (text): Comprehensive editorial review
   - `brand` (text): Manufacturer name (e.g., `Logitech`)
   - `category_id` (text, FK): Reference to categories table
   - `merchant_id` (text): Primary merchant identifier (`amazon`, `gumroad`, etc.)
   - `price_min` / `price_max` (numeric): Permitted price bounds
   - `currency` (varchar): e.g., `USD`
   - `image_url` (text): Primary studio photo URL
   - `status` (text): `'active' | 'draft' | 'paused' | 'archived'`
   - `editorial_badge` (text): `'Editor’s Choice' | 'Best Value' | 'Top Practical Pick' | 'Creator Favorite'`
   - `best_for` (text): The Sweet Spot summary
   - `not_for` (text): The Catch trade-off summary
   - `features` (jsonb): Specific physical specifications array
   - `limitations` (jsonb): Specific drawbacks array
   - `tested_in_house` (boolean): Flag indicating verified hands-on evaluation

2. **`affiliate_links`**:
   - `id` (text, PK): e.g., `link-prod-2`
   - `product_id` (text, FK): References `products.id`
   - `network` (text): `amazon | gumroad | impact | cj | shareasale | direct`
   - `url` (text): Target merchant link with affiliate tracking parameters
   - `last_checked_at` (timestamptz): Timestamp of last price/availability verification
   - `click_count` (integer): Total outbound clicks

3. **`collections`**:
   - `id` (text, PK): e.g., `col-1`
   - `slug` (text, unique): e.g., `home-office-starter-kit`
   - `title` (text): e.g., `The Calm Home Office Starter Kit`
   - `description` (text): Narrative introduction
   - `product_ids` (jsonb / array): Array of product IDs included in the kit
   - `status` (text): `'published' | 'draft'`
   - `last_reviewed_at` (timestamptz): Editorial audit date

4. **`site_settings`**:
   - `key` (text, PK): e.g., `seasonal_theme`
   - `value` (jsonb): Dynamic system settings (e.g., `{ "active": false, "theme": "halloween" }`)

---

## 7. Model Context Protocol (MCP) Integration

The application includes native MCP server capabilities located at `/api/mcp` and managed via [src/lib/mcp/handlers.ts](src/lib/mcp/handlers.ts). This allows AI agents (like Claude or Antigravity) to query, search, and manage the live storefront programmatically.

### Exposed Agent Tools
- `get_product`: Retrieves comprehensive specifications and live offers for a specific product ID.
- `search_catalog`: Runs multi-attribute filters across categories, price bands, and editorial badges.
- `create_product`: Validates and publishes a new product row into Supabase.
- `update_product`: Modifies prices, editorial badges, or affiliate URLs.
- `get_admin_stats`: Returns real-time click telemetry, stale offer counts, and conversion estimates.
- `set_seasonal_theme`: Enables or disables ambient theme overlays across the storefront.

---

## 8. Local Setup & Production Operations

### Environment Variables (`.env.local`)
Create a `.env.local` file modeled after `.env.example`:

```bash
# Storefront Base URL
NEXT_PUBLIC_BASE_URL=https://www.everyagedigital.store

# Supabase PostgreSQL Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-admin-key>

# Admin Control Center Access
ADMIN_EMAIL=admin@everyagedigital.com
ADMIN_PASSWORD=<secure-admin-password>

# Affiliate Merchant Settings
AMAZON_ASSOCIATE_TAG=everyagedigital-20
STALE_PRICE_DAYS=7
```

### Essential CLI Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (Turbopack)
npm run dev

# 3. Seed Supabase database with curated catalog
npm run seed:catalog

# 4. Seed companion books into database
npm run seed:books

# 5. Run test suites
npm run test          # Vitest unit & integration tests
npm run test:e2e      # Playwright end-to-end tests

# 6. Production build validation
npm run build

# 7. Production deploy to Vercel
npx vercel --prod --force --yes
```

---

## 9. Recent Critical Improvements & Polish Log

1. **Image Pipeline Modernization**:
   - Replaced all fallback image logic pointing to unrelated keyboard photos with the official Logitech MX Master 3S direct studio shot.
   - Removed `mix-blend-multiply` from all card frames, eliminating muddy gray box rendering on white and transparent assets.
   - Guaranteed full object visibility via `object-contain` scaling in the mobile/desktop gallery.
2. **DOM Cleanup & Layout Flow**:
   - Wrapped the "Books & Guides" homepage section in `{books.length > 0 && (...)}` so that empty catalog states are omitted without leaving awkward placeholders.
   - Dynamically reconfigured the homepage collections grid to `grid-cols-1 md:grid-cols-2` when 2 collections exist, perfectly centering cards without an empty 3rd column hole.
3. **High-Contrast Newsletter Band**:
   - Redesigned `EmailSignup.tsx` to utilize standard editorial tokens (`bg-[#faf9f6] dark:bg-[#0d1117]`).
   - Upgraded eyebrow text to `text-neutral-700 dark:text-neutral-300 font-semibold`, achieving WCAG AAA contrast in both light and dark modes.
4. **Brand Unification**:
   - Unified header emblem badge from `EveryAge Editorial` to `EveryAge Digital`, matching the footer and domain name.
   - Eliminated doubled brand titles on product pages.
5. **UI & Spacing Polish**:
   - Darkened category and section eyebrow labels by one step across the entire application for maximum readability.
   - Replaced cramped search input layout with a side-by-side flex layout (`min-h-[42px]`), giving the `Query` button dedicated margins.
   - Integrated line-clamp with inline `Read kit brief →` links to prevent mid-word description truncation on kit cards.

---

*EveryAge Digital stands as an uncompromising benchmark in tactile digital commerce architecture.*
