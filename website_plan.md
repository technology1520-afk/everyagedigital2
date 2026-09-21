You are a principal product designer, ecommerce UX architect, affiliate-commerce engineer, AI shopping assistant engineer, SEO strategist, data architect, and QA engineer.

Build a production-quality affiliate commerce storefront named EveryAge Digital.

This is NOT an AI-tools directory.
This is NOT a generic blog.
This is NOT a normal ecommerce store that owns physical inventory.
This is a curated affiliate shopping marketplace and digital-product store.

The website helps people discover useful everyday products, books, digital products, PDF guides, courses, knowledge resources, creator products, home-office products, electronics, productivity items, lifestyle products, and other practical goods.

Visitors can browse and compare products on the website, but affiliate products are purchased on the external merchant website through a properly configured affiliate link.

The website may earn commission from:
- Amazon Associates
- Gumroad affiliate links
- ClickBank
- Impact
- CJ
- Awin
- ShareASale
- PartnerStack
- Direct brand affiliate programs
- Other approved affiliate networks

The website may sell the owner’s own digital products through a merchant-of-record provider such as Lemon Squeezy, Paddle, or another approved provider.

The website must look like a premium, trustworthy, modern shopping publication—not like a rushed AI-generated website.

==================================================
1. INSPECT THE PROJECT FIRST
==================================================
- Framework: Next.js App Router
- TypeScript
- Tailwind CSS
- Accessible component primitives (Lucide icons, headless accessible UI components)
- Seed database & typed repository layer (PostgreSQL / Supabase compatible schemas and query adapters)
- Zod validation
- Server actions and API routes
- Search adapter interface (supports full-text search, extensible to Meilisearch / Typesense)
- Vitest unit tests
- ESLint and strict TypeScript

==================================================
2. PRODUCT DEFINITION
==================================================
The central promise is:
“Discover useful products, books, digital resources, and everyday essentials—curated clearly and recommended intelligently.”

Affiliate products:
- Show product information, approved imagery, merchant, price status, availability status
- Link directly to the merchant using compliant affiliate URLs
- Clear affiliate & sponsored disclosures

Owned products:
- Show product page, price, checkout, delivery info, refund policy
- Secure payment provider abstraction with demo checkout mode

==================================================
3. TARGET USERS & MARKETS
==================================================
Students, freelancers, creators, remote workers, small online-business owners, everyday shoppers.
International accessibility with currency and regional offer support.

==================================================
4. BRAND AND VISUAL DIRECTION
==================================================
Editorial commerce design:
--background: #F7F7F4
--surface: #FFFFFF
--surface-muted: #F0F1ED
--text: #151515
--text-secondary: #667085
--border: #E4E7EC
--accent: #234F9E
--accent-hover: #193B7A
--success: #18794E
--warning: #A15C00
--danger: #B42318
--featured: #F2EBDD

Calm, trustworthy, selective, and useful. No neon purple AI vibes, no fake reviews or fake metrics.

==================================================
5. REQUIRED ROUTES
==================================================
- / (Homepage & featured storefront)
- /shop (Main product marketplace with filters & sort)
- /search (Search results page)
- /category/[slug] (Category page)
- /merchant/[slug] (Merchant / marketplace page)
- /product/[slug] (Product detail & recommendation page)
- /collection/[slug] (Curated collection page)
- /books (Books, PDFs, guides, and knowledge resources)
- /books/[slug] (Book or digital-resource detail page)
- /deals (Deals & price-sensitive recommendations)
- /compare (Product comparison builder)
- /compare/[slug] (Shareable comparison page)
- /assistant (AI shopping receptionist)
- /wishlist & /my-list (Saved products & collections)
- /shop/own-products (Owner's digital products)
- /shop/own-products/[slug] (Owned digital product detail)
- /about (About the publisher & curation mission)
- /methodology (How products are selected & evaluated)
- /affiliate-disclosure (Affiliate relationships & compliance)
- /privacy (Privacy policy placeholder)
- /terms (Terms of service placeholder)
- /contact (Contact form & inquiries)

==================================================
6. AI SHOPPING RECEPTIONIST
==================================================
Named EveryAge Assistant (or Sage).
Behaves like a polite digital shopping receptionist:
- Guided inquiry (budget, use case, physical vs digital, preferred merchant, region)
- Retrieval-grounded strictly in stored catalog (tools: searchCatalog, filterByBudget, filterByCategory, etc.)
- Transparent reasons ("Matches your budget", "Sold by your preferred merchant")
- Never hallucinates prices, reviews, or uncataloged items

==================================================
7. AFFILIATE INTEGRATION & COMPLIANCE
==================================================
- Adapter architecture for affiliate providers (Amazon, Gumroad, Impact, Direct, Owned)
- Direct transparent links with `rel="sponsored nofollow noopener"`
- Amazon Associates exact disclosure: “As an Amazon Associate I earn from qualifying purchases.”
- General affiliate disclosure near all CTA buttons
- Price freshness tracking (lastCheckedAt, staleAfter)
- Clear "Check current price" for stale prices

==================================================
8. OWNED DIGITAL PRODUCTS & DEMO CHECKOUT
==================================================
- Payment provider abstraction (Lemon Squeezy / Paddle / Demo)
- Clear demo checkout modal/flow: "Demo checkout—not connected to a real payment provider."
