You are a principal product designer, ecommerce UX architect, affiliate-commerce engineer, AI shopping assistant engineer, SEO strategist, data architect, and QA engineer.

Build a production-quality affiliate commerce storefront named [BRAND_NAME].

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

Before writing code:

1. Inspect the repository.
2. Identify the framework, package manager, existing routes, components, database, styling system, authentication, and environment variables.
3. Reuse existing architecture where practical.
4. Do not delete existing work without inspecting it.
5. If the project is empty, create a modern full-stack application.

If no stack exists, use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Accessible component primitives
- PostgreSQL or Supabase-compatible database
- Zod validation
- Server actions or API routes
- PostgreSQL full-text search for the first version
- A search adapter interface that can later support Meilisearch, Typesense, or Elasticsearch
- Vitest or Jest
- Playwright
- ESLint
- Strict TypeScript

Do not install unnecessary dependencies.

==================================================
2. PRODUCT DEFINITION
==================================================

The central promise is:

“Discover useful products, books, digital resources, and everyday essentials—curated clearly and recommended intelligently.”

The website must help visitors answer:

- What should I buy?
- Which product is right for my situation?
- Which book or PDF can help me?
- Is there a cheaper alternative?
- Is this digital product or physical product relevant to me?
- Which merchant sells it?
- Is the recommendation sponsored?
- Is there an affiliate relationship?
- When was the information checked?

The website is a recommendation and discovery platform.

For affiliate products:

- Show product information
- Show approved product imagery
- Show the merchant
- Show price only when current and permitted
- Show availability only when current and permitted
- Link directly to the merchant using the affiliate URL
- Never pretend the affiliate product is sold by this website

For owned products:

- Show the product page
- Show your own price
- Show checkout
- Show delivery information
- Show refund policy
- Use a secure payment provider

==================================================
3. TARGET USERS
==================================================

Primary audience:

- Students
- Freelancers
- Creators
- Remote workers
- Small online-business owners
- People looking for useful everyday products
- People interested in books, PDFs, courses, and knowledge resources
- People who want practical recommendations without browsing endless product pages

The initial market is English-speaking and internationally accessible.

Support country-aware offers later.

Never display an offer as available in a country unless the merchant, product, currency, delivery, and affiliate program support that market.

==================================================
4. BRAND AND VISUAL DIRECTION
==================================================

Use a premium editorial commerce design.

The design should combine:

- Modern retail clarity
- Editorial magazine quality
- Professional product discovery
- Calm information architecture
- High-quality photography
- Strong typography
- Restrained cards
- Clear merchant labels
- Elegant filtering and sorting
- Excellent mobile experience

Do not copy Amazon, ShopMy, LTK, Apple, Linear, Notion, or any other company.

Use original styling inspired by professional commerce and editorial principles.

Avoid:

- Purple neon AI aesthetics
- Excessive gradients
- Glassmorphism everywhere
- Fake 3D objects
- Decorative blobs
- Huge meaningless statistics
- Fake testimonials
- Fake reviews
- Fake product popularity numbers
- Emoji-heavy UI
- Random inconsistent colors
- Large cards with no useful information
- Generic SaaS landing-page sections
- “Powered by AI” claims everywhere

The website should feel calm, trustworthy, selective, and useful.

Suggested design tokens:

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

Use:

- Warm off-white background
- White product surfaces
- Deep charcoal text
- One primary blue, green, or terracotta accent
- Subtle borders
- Light shadows
- 8px spacing system
- 8px to 16px component radius
- 24px to 32px section radius only where appropriate
- No excessive rounded “pill” styling

Typography:

- Use a highly readable sans-serif for interfaces
- Use a distinctive editorial display font for selected headings
- Keep body text comfortable on mobile
- Use monospace only for metadata, IDs, or technical values
- Maintain strong heading hierarchy

==================================================
5. REQUIRED ROUTES
==================================================

Create these routes:

/
Homepage and featured storefront.

/shop
Main product marketplace.

/search
Search results page.

/category/[slug]
Category page.

/merchant/[slug]
Merchant or marketplace page.

/product/[slug]
Product detail and recommendation page.

/collection/[slug]
Curated collection page.

/books
Books, PDFs, guides, and knowledge resources.

/books/[slug]
Book or digital-resource detail page.

/deals
Deals and price-sensitive recommendations.

/compare
Product comparison builder.

/compare/[slug]
Shareable comparison page.

/assistant
AI shopping receptionist.

/wishlist
Saved products and collections.

/my-list
Optional local saved list without requiring an account.

/shop/own-products
The owner’s own digital products.

/shop/own-products/[slug]
Owned digital-product detail page.

/about
About the publisher and curation mission.

/methodology
Explain how products are selected and evaluated.

/affiliate-disclosure
Explain affiliate relationships.

/privacy
Privacy policy placeholder with clear legal-review TODO markers.

/terms
Terms placeholder with clear legal-review TODO markers.

/contact
Contact page.

If an admin area is needed, create it only behind proper authentication.

==================================================
6. HOMEPAGE
==================================================

The homepage should be an editorial storefront, not a generic SaaS landing page.

Header:

- Logo
- Shop
- Categories
- Collections
- Books
- Deals
- Assistant
- Search
- Saved list
- Optional account entry

Hero:

Headline:
“Find things worth buying, reading, and using.”

Supporting copy:
“Curated products, useful books, digital resources, and everyday recommendations—with clear information before you click.”

Primary CTA:
“Start browsing”

Secondary CTA:
“Ask the shopping assistant”

Homepage sections:

1. Hero search bar
2. Popular categories
3. Curated collections
4. Everyday essentials
5. Featured books and knowledge products
6. Trending or recently reviewed products
7. AI shopping receptionist introduction
8. Owner’s digital products
9. How affiliate recommendations work
10. Email signup
11. Footer

Hero search placeholder:

“What are you looking for today?”

Search examples:

- “Best desk setup under $150”
- “Books for learning business”
- “Useful gifts for a student”
- “PDF guides for freelancers”
- “Affordable kitchen essentials”
- “Tools for a small home office”

Do not show fake sales counts, fake reviews, or fake “millions of happy customers.”

==================================================
7. PRODUCT MARKETPLACE
==================================================

Build a professional product marketplace at /shop.

Each product card should support:

- Product image
- Product name
- Brand
- Short description
- Product type
- Merchant name
- Price if allowed
- Currency
- Price status
- Availability status if allowed
- Editorial badge
- Affiliate or owned-product badge
- Sponsored badge when applicable
- Last checked date
- Primary CTA
- Save button
- Compare button

External affiliate CTA labels:

- “View at Amazon”
- “View on Gumroad”
- “See offer”
- “Visit merchant”
- “Check current price”

Do not label an external affiliate link “Buy now” unless the user is clearly being taken to the merchant checkout and the wording is allowed.

Owned product CTA:

- “Buy the PDF”
- “Get the guide”
- “Download after checkout”

Filters:

- Category
- Product type
- Merchant
- Physical or digital
- Price range
- Currency
- Region
- Format
- Availability
- Free or paid
- New or established
- Editorial pick
- Sponsored
- Book, PDF, course, template, or physical product

Sorting:

- Relevance
- Editorial picks
- Price low to high
- Price high to low
- Newest review
- Recently added
- Popularity only when verified
- Deals
- Alphabetical

Never sort primarily by commission rate.

Never allow a merchant to secretly buy a higher editorial ranking.

Use a clear “Sponsored” label for paid placements.

==================================================
8. AI SHOPPING RECEPTIONIST
==================================================

Build a product recommendation assistant named [ASSISTANT_NAME].

The assistant must behave like a polite digital shopping receptionist.

It should:

1. Welcome the visitor.
2. Ask what they are looking for.
3. Ask about budget.
4. Ask about intended use.
5. Ask about location or country when relevant.
6. Ask whether they prefer physical or digital products.
7. Ask whether they prefer Amazon, Gumroad, or another merchant.
8. Ask about urgency.
9. Return a short list of relevant products.
10. Explain why each product fits.
11. Show limitations.
12. Offer alternatives.
13. Show affiliate or sponsored disclosures.
14. Link directly to the merchant.

Example opening:

“Welcome. What are you looking for today?”

Quick suggestions:

- Everyday essentials
- Books and PDFs
- Home office
- Gifts
- Student products
- Creator equipment
- Digital resources
- Budget deals

The assistant must be retrieval-grounded.

It may only recommend products returned by the approved catalog search tools.

Create tools/functions such as:

- searchCatalog
- filterByBudget
- filterByCategory
- filterByMerchant
- filterByCountry
- findDigitalProducts
- findPhysicalProducts
- compareProducts
- findAlternatives
- getProductFreshness
- getCollection

The assistant must never:

- Invent product prices
- Invent availability
- Invent product reviews
- Invent affiliate relationships
- Claim that the website sells Amazon products
- Claim that it represents Amazon, Gumroad, or another merchant
- Recommend products outside the stored catalog
- Rank products only because they pay higher commission
- Give medical, legal, financial, or safety advice without a strict limitation notice
- Hide sponsorships
- Use a product’s affiliate commission as the user-facing recommendation reason

If no reliable product matches exist, say:

“I could not verify a suitable match from the current catalog. Try changing the budget, category, or merchant.”

Display recommendation reasons such as:

- “Matches your budget”
- “Available as a digital download”
- “Good for beginners”
- “Sold by your preferred merchant”
- “Suitable for small workspaces”

Do not display an unexplained AI score.

The assistant should be text-first.

Optional future features:

- Voice input
- Voice output
- Human support handoff
- Saved taste profile
- Email recommendations
- Price alerts

Do not make voice functionality required for the MVP.

==================================================
9. PRODUCT DETAIL PAGE
==================================================

Each product page must include:

1. Product image
2. Product name
3. Brand
4. Product type
5. Merchant
6. Short factual description
7. Best for
8. Not ideal for
9. Important features
10. Benefits
11. Limitations
12. Price information
13. Price last-checked date
14. Availability last-checked date
15. Region availability
16. Alternative products
17. Related collection
18. Related book or guide
19. Affiliate disclosure
20. Source/evidence information
21. Direct merchant CTA
22. Save button
23. Compare button

Use these information labels:

- Official merchant information
- Editorial summary
- Hands-on tested
- Community feedback
- Price checked
- Affiliate link
- Sponsored placement
- Owned product

Never claim hands-on testing unless it actually happened.

Never display fake star ratings.

Never import ratings from a third-party website unless the license and data source permit it.

Never copy an entire merchant product description.

==================================================
10. BOOKS, PDFS, AND KNOWLEDGE PRODUCTS
==================================================

Create a dedicated books and knowledge area.

Support:

- Physical books
- Ebooks
- PDF books
- Courses
- Templates
- Prompt packs
- Checklists
- Knowledge bundles
- Digital downloads
- Creator products
- Owned products
- Affiliate products

Clearly separate:

1. “Our products”
2. “Recommended from partners”
3. “Affiliate products”
4. “Editorial book recommendations”

For each book or knowledge product include:

- Cover image from an approved source
- Title
- Author or creator
- Format
- Price if permitted
- Merchant
- Short summary
- Who it is for
- What the reader will learn
- Difficulty
- Related products
- Related collection
- Affiliate disclosure
- Direct merchant link
- Last checked date

Do not host or redistribute someone else’s PDF without explicit permission.

Do not use copyrighted book-cover images unless an approved source or license allows it.

==================================================
11. CURATED COLLECTIONS
==================================================

Create collections instead of only individual product pages.

Initial collections:

- Everyday Essentials
- Home Office Starter Kit
- Books for Learning Business
- Student Study Essentials
- Creator Desk Setup
- Digital Products for Freelancers
- Budget-Friendly Picks
- Useful Gifts
- Knowledge for Building Online Income
- Simple Productivity Setup
- Travel Essentials
- Kitchen and Home Basics

Each collection must include:

- Collection title
- Editorial introduction
- Target audience
- Selection criteria
- Products
- Merchant labels
- Affiliate disclosure
- Last reviewed date
- Related collections
- Optional downloadable checklist

Do not create collections with no editorial explanation.

==================================================
12. WISHLIST AND SAVED LISTS
==================================================

Implement a saved-list feature.

MVP:

- Local browser storage
- Add/remove product
- Add/remove collection
- Compare saved products
- Shareable list if safe

Later:

- Accounts
- Cloud synchronization
- Email alerts
- Price-drop alerts
- Recommendation history

Do not require account creation for basic browsing or saving.

==================================================
13. AFFILIATE INTEGRATION ARCHITECTURE
==================================================

Do not hard-code affiliate links throughout the frontend.

Create an adapter architecture.

Affiliate provider interface:

- providerName
- programName
- country
- currency
- searchProducts
- getProduct
- getOffer
- getProductImage
- getPrice
- getAvailability
- getAffiliateUrl
- getLastUpdated
- validateLink
- complianceNotes

Support provider adapters for:

- Amazon
- Gumroad
- Impact
- ClickBank
- CJ
- Awin
- ShareASale
- PartnerStack
- Direct merchant programs
- Owned products

The first version may use a seed catalog and mock provider adapters if credentials are missing.

Never pretend an integration is live when credentials are missing.

Use environment variables for all credentials.

Never expose API keys in browser JavaScript.

Do not scrape Amazon or other merchant pages as the primary data source.

Prefer:

- Official APIs
- Official product feeds
- Affiliate network feeds
- Approved widgets
- Merchant-provided assets
- Manually entered links when permitted

For every offer store:

- Product ID
- Merchant
- Affiliate provider
- Original merchant URL
- Affiliate URL
- Source product ID
- Product image URL
- Image source
- Image permission/license
- Price
- Currency
- Availability
- Region
- Last checked timestamp
- Expiration timestamp
- Terms/compliance notes
- Affiliate disclosure requirement

==================================================
14. PRODUCT IMAGE RULES
==================================================

Images are legally and technically important.

Only use:

- Approved affiliate-program images
- Official API images
- Licensed merchant images
- Your own photography
- Properly licensed stock images
- Owner-created illustrations

For every image store:

- imageUrl
- imageSource
- imageLicense
- sourceProductId
- altText
- imageLastChecked

Do not:

- Download random product images from Google
- Copy retailer images without permission
- Rehost images when the program only permits hotlinking or approved API use
- Mix images from one product with another product
- Generate a fake image that looks like the merchant’s actual product
- Use a merchant logo without permission

When an image is unavailable, show a clean neutral placeholder.

==================================================
15. LINK AND TRACKING RULES
==================================================

Affiliate links must be direct and transparent.

Do not create a generic redirect such as:

/go/product-name

unless the specific affiliate program permits it.

Prefer a direct anchor link to the affiliate destination.

Track outbound clicks using privacy-conscious analytics without replacing the destination URL.

Use:

- rel="sponsored nofollow noopener"
- target="_blank" where appropriate
- accessible link labels
- affiliate disclosure near the CTA

Do not cloak affiliate URLs.

Do not hide the merchant name.

Do not automatically redirect visitors to a merchant without a visible user action.

For Amazon, use the exact required Amazon Associates disclosure:

“As an Amazon Associate I earn from qualifying purchases.”

For other affiliate programs, use a clear disclosure such as:

“This page contains affiliate links. If you purchase through one of these links, we may earn a commission at no additional cost to you.”

==================================================
16. DATA MODEL
==================================================

Create these entities.

Product:

- id
- slug
- name
- brand
- description
- productType
- category
- subcategory
- useCases
- bestFor
- notFor
- features
- benefits
- limitations
- officialUrl
- sourceProvider
- sourceProductId
- imageUrl
- imageSource
- imageLicense
- altText
- region
- language
- status
- editorialNotes
- handsOnTested
- editorialConfidence
- createdAt
- updatedAt

MerchantOffer:

- id
- productId
- merchantName
- providerName
- affiliateProgram
- originalUrl
- affiliateUrl
- currency
- price
- priceType
- availability
- region
- shippingNote
- lastCheckedAt
- staleAfter
- complianceNotes
- active

OwnedProduct:

- id
- slug
- title
- description
- productType
- price
- currency
- coverImage
- includedItems
- preview
- checkoutUrl
- paymentProvider
- refundPolicy
- status
- createdAt
- updatedAt

Collection:

- id
- slug
- title
- introduction
- selectionCriteria
- productIds
- bookIds
- lastReviewedAt
- status

Book:

- id
- slug
- title
- author
- creator
- format
- description
- coverImage
- imageLicense
- merchant
- affiliateUrl
- owned
- price
- currency
- lastCheckedAt
- disclosureRequired
- status

AffiliateProgram:

- id
- providerName
- programName
- region
- termsUrl
- disclosureText
- imageRules
- priceRules
- linkRules
- active

SourceEvidence:

- id
- productId
- sourceUrl
- sourceType
- quote
- retrievedAt
- confidence
- notes

ClickEvent:

- id
- productId
- offerId
- merchant
- sourcePage
- timestamp
- anonymousSessionId
- country
- deviceType

AssistantSession:

- id
- anonymousSessionId
- preferences
- recommendations
- createdAt
- retentionDate

Never expose internal commissionRate to users.

Do not use commissionRate as the primary ranking field.

==================================================
17. SEARCH AND CATALOG SCALE
==================================================

The system should support millions of products in the future without rendering millions of static pages.

Implement:

- Database-backed catalog
- Search adapter
- Faceted filters
- Pagination or cursor pagination
- Query caching
- Product deduplication
- Merchant-offer grouping
- Canonical product identity
- Region-aware offers
- Stale-data detection
- Provider-specific refresh jobs

Do not generate indexable pages for every low-value product.

Only index product pages with:

- Meaningful editorial content
- Correct product data
- Valid source information
- A current offer
- Clear user value

Avoid thin affiliate pages.

Start with a small, curated seed catalog and clearly mark it as demo data if live integrations are not configured.

==================================================
18. DATA FRESHNESS
==================================================

Prices, availability, shipping, and promotions change.

Store:

- lastCheckedAt
- staleAfter
- sourceTimestamp

If data is stale:

- Hide the old price
- Display “Check current price”
- Do not display old availability as current
- Ask the user to verify the merchant page

Never fabricate current prices.

Never use “lowest price” unless verified.

Never use “best seller” unless the source provides that status.

==================================================
19. AI RECOMMENDATION LOGIC
==================================================

The AI recommendation system must rank by user fit, not commission.

Ranking signals:

- Category match
- Use-case match
- Budget match
- Region match
- Format match
- Merchant preference
- Freshness
- Editorial quality
- Verified availability
- User-selected priorities

Commission may be stored privately for business analytics but must not secretly override relevance.

Every AI recommendation must return:

- Product
- Merchant
- Reason
- Limitations
- Price status
- Freshness status
- Affiliate/sponsored label
- Direct link

Use a deterministic catalog filter before any language-model response.

The language model may summarize retrieved records but may not invent facts.

==================================================
20. OWNED DIGITAL PRODUCTS
==================================================

Build a separate “Our Products” area.

Possible products:

- PDF books
- Knowledge guides
- Freelance checklists
- Productivity templates
- Business templates
- Prompt packs
- Digital workbooks
- Study guides
- Notion templates
- Spreadsheet templates

Use a payment-provider abstraction.

Support demo mode when credentials are missing, but clearly label it:

“Demo checkout—not connected to a real payment provider.”

Never pretend a demo payment succeeded.

Do not store payment secrets in the frontend.

Add webhook verification for production payment events.

==================================================
21. SEO
==================================================

Implement:

- Unique metadata per route
- Open Graph metadata
- Twitter/X card metadata
- Canonical URLs
- Sitemap
- Robots.txt
- Breadcrumbs
- Clean slugs
- Internal links
- Article schema for guides
- Product schema only when accurate
- Product snippet schema for suitable affiliate/editorial pages
- Organization schema
- Owned-product schema where accurate

Do not use merchant-listing structured data for products that visitors cannot purchase directly from this website.

Do not include:

- Fake reviews
- Fake ratings
- Unsupported price
- Unsupported availability
- Unsupported shipping
- Unsupported seller claims

Do not index every filter combination.

Use noindex or canonical handling for dynamic search and filter URLs where appropriate.

==================================================
22. CONTENT AND TRUST
==================================================

Every editorial product page should provide original value.

Include:

- Why this product is useful
- Who should consider it
- Who should avoid it
- What alternatives exist
- Practical limitations
- Decision factors
- Last checked date
- Source notes
- Affiliate disclosure

Do not publish copied merchant descriptions as the main content.

Do not claim first-hand testing unless the product was actually tested.

Do not claim a product is safe, healthy, secure, or effective without reliable evidence.

Avoid medical, financial, legal, and high-risk product recommendations in the initial version.

Add editorial labels:

- Editorial pick
- Partner offer
- Sponsored
- Our product
- Digital download
- Price checked
- Limited information

==================================================
23. ANALYTICS
==================================================

Create privacy-conscious event tracking for:

- search_submitted
- filter_applied
- product_viewed
- collection_viewed
- assistant_started
- assistant_completed
- product_saved
- comparison_started
- affiliate_clicked
- owned_product_viewed
- checkout_started
- purchase_completed

Do not store sensitive personal information.

Do not send private assistant conversations to analytics.

If analytics credentials are missing, log events only in development.

==================================================
24. ACCESSIBILITY
==================================================

Meet WCAG 2.2 AA as closely as practical.

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible search
- Accessible filters
- Accessible dialogs
- Accessible product cards
- Accessible comparison tables
- Accessible assistant messages
- Screen-reader labels
- Minimum 44px touch targets
- Good color contrast
- Reduced-motion support
- No color-only status indicators
- Skip-to-content link
- Correct heading hierarchy
- Proper form error messages

==================================================
25. SECURITY
==================================================

Implement:

- Server-side validation
- Zod schemas
- Safe external URL validation
- Protection against open redirects
- SSRF protection for provider fetchers
- Rate limiting for assistant and contact forms
- No API secrets in client code
- Sanitized external product data
- Safe HTML rendering
- Signed payment webhooks
- Secure admin authentication if admin features are added
- Error messages that do not expose secrets

==================================================
26. REQUIRED UI COMPONENTS
==================================================

Create reusable components:

- SiteHeader
- SiteFooter
- GlobalSearch
- CategoryNavigation
- ProductCard
- ProductGrid
- ProductList
- MerchantBadge
- AffiliateDisclosure
- SponsoredBadge
- OwnedProductBadge
- PriceStatus
- FreshnessLabel
- FilterPanel
- SortMenu
- CollectionCard
- BookCard
- WishlistButton
- CompareButton
- ComparisonTable
- ShoppingAssistant
- AssistantMessage
- AssistantRecommendation
- ProductImage
- EmptyState
- LoadingState
- ErrorState
- Breadcrumbs
- ShareButton
- EmailSignup
- CheckoutButton
- EvidencePanel

Do not place the entire application inside one huge component.

==================================================
27. TESTING
==================================================

Add tests for:

1. Product filtering
2. Product sorting
3. Category filtering
4. Merchant filtering
5. Price-range filtering
6. Region filtering
7. Digital versus physical products
8. Affiliate disclosure rendering
9. Amazon disclosure rendering
10. Sponsored-label rendering
11. Owned-product checkout
12. Demo checkout mode
13. Direct affiliate link behavior
14. No open redirect
15. AI assistant retrieval grounding
16. Assistant recommendation reasons
17. No commission-based ranking
18. Stale price handling
19. Wishlist behavior
20. Comparison limit
21. Search empty state
22. Mobile navigation
23. Accessibility basics
24. SEO metadata
25. Production build

End-to-end flows:

- Visitor searches for a product
- Visitor filters by category and price
- Visitor sorts products
- Visitor opens a product page
- Visitor sees affiliate disclosure
- Visitor clicks an external merchant link
- Visitor saves a product
- Visitor compares products
- Visitor asks the AI receptionist for recommendations
- Visitor browses a collection
- Visitor opens a book page
- Visitor opens an owned PDF product
- Visitor reaches demo checkout
- Visitor submits the contact form

Run:

- TypeScript check
- Lint
- Unit tests
- End-to-end tests
- Production build

Do not claim that a test passed unless the command actually passed.

==================================================
28. IMPLEMENTATION PHASES
==================================================

Phase 1:

- Inspect the repository
- Create design tokens
- Build site shell
- Build homepage
- Build header, footer, search, categories, and product cards

Phase 2:

- Create product, offer, merchant, book, and collection schemas
- Add seed catalog
- Build /shop
- Build search
- Build filters
- Build sorting
- Build product pages

Phase 3:

- Build collections
- Build books and knowledge products
- Build wishlist
- Build comparison pages

Phase 4:

- Build the AI shopping receptionist
- Connect it only to the structured catalog
- Add transparent recommendation reasons
- Add product and merchant disclosures

Phase 5:

- Add affiliate-provider adapters
- Add Amazon adapter interface
- Add Gumroad adapter interface
- Add affiliate-network adapter interface
- Add image-rights metadata
- Add freshness checks

Phase 6:

- Add owned digital products
- Add payment-provider abstraction
- Add demo checkout
- Add webhook structure

Phase 7:

- Add SEO
- Add analytics
- Add accessibility improvements
- Add security controls
- Add tests
- Run production build

==================================================
29. FINAL QUALITY AUDIT
==================================================

Before finishing, verify:

Product:

- Is this clearly an affiliate shopping storefront?
- Are products grouped by useful categories?
- Can people search, filter, sort, save, and compare?
- Can visitors find books, PDFs, and digital products?
- Is the AI receptionist useful but not intrusive?
- Are owned products separated from affiliate products?

Affiliate compliance:

- Are affiliate relationships obvious?
- Is the Amazon disclosure present where necessary?
- Are affiliate links direct and transparent?
- Are product images sourced legally?
- Are current prices and availability handled honestly?
- Are merchant terms respected?
- Are sponsored products clearly labeled?
- Is commission excluded from public recommendation ranking?

Design:

- Does the site look premium and professional?
- Is it visually calm and coherent?
- Does it avoid generic vibe-coding patterns?
- Does it work well on mobile?
- Are product cards information-rich but not crowded?
- Are there no fake statistics or fake reviews?

Engineering:

- Does TypeScript pass?
- Does lint pass?
- Do tests pass?
- Does the production build pass?
- Are credentials kept server-side?
- Does the app run safely without external API keys?
- Is demo mode clearly marked?
- Are stale product data handled safely?

==================================================
30. FINAL RESPONSE
==================================================

After implementation, report:

1. What was built
2. Main routes
3. Product catalog features
4. AI receptionist features
5. Affiliate integration status
6. Digital-product checkout status
7. Image and compliance protections
8. Database schema
9. Tests run and exact results
10. Required environment variables
11. Known limitations
12. Recommended next step

Do not stop after writing a plan.

Inspect the repository, implement the website, run the tests, fix failures, and verify the production build.
