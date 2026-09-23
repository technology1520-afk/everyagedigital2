import { 
  Product, 
  MerchantOffer, 
  OwnedProduct, 
  Collection, 
  Book, 
  AffiliateProgram, 
  SourceEvidence 
} from '../types';

export const AFFILIATE_PROGRAMS: AffiliateProgram[] = [
  {
    id: 'prog-amazon',
    providerName: 'Amazon Associates',
    programName: 'Amazon Associates Program',
    region: ['US', 'UK', 'CA', 'EU', 'Global'],
    termsUrl: 'https://affiliate-program.amazon.com/help/operating/agreement',
    disclosureText: 'As an Amazon Associate I earn from qualifying purchases.',
    imageRules: 'Images must be served via approved Product Advertising API or official site widget.',
    priceRules: 'Prices change rapidly. Must display last updated time or indicate "Check current price".',
    linkRules: 'Direct link with rel="sponsored nofollow noopener". No link cloaking.',
    active: true
  },
  {
    id: 'prog-gumroad',
    providerName: 'Gumroad',
    programName: 'Gumroad Affiliate Network',
    region: ['Global'],
    termsUrl: 'https://gumroad.com/terms',
    disclosureText: 'This page contains affiliate links. We may earn a commission if you purchase.',
    imageRules: 'Creator authorized product covers.',
    priceRules: 'Fixed digital product pricing.',
    linkRules: 'Direct affiliate link to creator product page.',
    active: true
  },
  {
    id: 'prog-impact',
    providerName: 'Impact',
    programName: 'Impact Radius Partnership',
    region: ['US', 'EU', 'Global'],
    termsUrl: 'https://impact.com',
    disclosureText: 'We partner with brands via Impact and may earn referral commissions.',
    imageRules: 'Brand press assets and licensed images.',
    priceRules: 'Updated per merchant feed.',
    linkRules: 'Direct affiliate link with rel="sponsored".',
    active: true
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'benq-screenbar-plus-monitor-light',
    name: 'BenQ ScreenBar Plus Monitor Light',
    brand: 'BenQ',
    description: 'An auto-dimming e-reading monitor lamp with an external desktop dial that balances desk illumination without creating screen glare.',
    productType: 'physical',
    category: 'Home Office',
    subcategory: 'Desk Lighting',
    useCases: ['Late-night writing', 'Dual-monitor productivity', 'Small desk spaces'],
    bestFor: 'Remote workers, coders, and writers suffering from eye fatigue on crowded desks.',
    notFor: 'Laptops or ultra-curved monitors (>1000R curvature) without an extra adapter.',
    features: [
      'Weighted counterbalanced clamp (zero desk footprint)',
      'Precision external desktop dial for brightness & color temperature',
      'Asymmetric optical design prevents screen reflection',
      'Ambient light sensor for auto-dimming'
    ],
    benefits: [
      'Frees up entire desk surface from traditional bulky lamp bases',
      'Noticeably relieves eye strain during evening work sessions',
      'Stepless smooth brightness and color temperature adjustment'
    ],
    limitations: [
      'Pricier than budget clip-on LED strips',
      'Requires an available USB-A port (5V/1A minimum) or dedicated wall adapter'
    ],
    officialUrl: 'https://www.benq.com/en-us/lighting/monitor-light/screenbar-plus.html',
    sourceProvider: 'Amazon Associates',
    sourceProductId: 'B07DP7RYXV',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Brand Press Kit / Verified Retailer Feed',
    imageLicense: 'Official Affiliate Feed',
    altText: 'BenQ ScreenBar Plus mounted on top of a computer monitor with external desktop dial control',
    region: ['US', 'UK', 'CA', 'EU'],
    language: 'en',
    status: 'active',
    editorialNotes: 'A benchmark in desk lighting. Tested across 8 months of daily remote coding.',
    handsOnTested: true,
    editorialConfidence: 'High',
    editorialBadge: 'Editor’s Choice',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z'
  },
  {
    id: 'prod-2',
    slug: 'logitech-mx-master-3s-ergonomic-mouse',
    name: 'Logitech MX Master 3S Wireless Mouse',
    brand: 'Logitech',
    description: 'Quiet-click ergonomic performance mouse featuring an 8,000 DPI track-on-glass sensor and MagSpeed electromagnetic scroll wheel.',
    productType: 'physical',
    category: 'Home Office',
    subcategory: 'Computer Peripherals',
    useCases: ['Spreadsheet navigation', 'Timeline video editing', 'Long typing/coding days'],
    bestFor: 'Power users, designers, and programmers who switch between multiple computers.',
    notFor: 'Left-handed users (strictly right-handed shape) or small-handed travel setups.',
    features: [
      'MagSpeed electromagnetic wheel (scrolls 1,000 lines per second)',
      '8K DPI sensor tracks on any surface including clear glass',
      'Quiet click switches reducing 90% click noise',
      'Flow multi-computer control across Windows and macOS'
    ],
    benefits: [
      'Exceptional palm ergonomics minimizing wrist forearm torsion',
      'Horizontal thumb scroll wheel revolutionizes wide sheet navigation',
      'Battery lasts up to 70 days on a single USB-C charge'
    ],
    limitations: [
      'Requires Logi Options+ software for gesture customizations',
      'Heavier than typical lightweight competitive gaming mice (141g)'
    ],
    officialUrl: 'https://www.logitech.com/en-us/products/mice/mx-master-3s.html',
    sourceProvider: 'Amazon Associates',
    sourceProductId: 'B09HM94VDS',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Manufacturer Press Kit',
    imageLicense: 'Official Affiliate Feed',
    altText: 'Logitech MX Master 3S ergonomic wireless mouse resting on a clean wood desk',
    region: ['Global'],
    language: 'en',
    status: 'active',
    editorialNotes: 'Gold standard ergonomic office mouse. Reliable, tactile, and whisper-quiet.',
    handsOnTested: true,
    editorialConfidence: 'High',
    editorialBadge: 'Top Practical Pick',
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-03-14T14:00:00Z'
  },
  {
    id: 'prod-3',
    slug: 'sony-wh-1000xm5-noise-canceling-headphones',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    description: 'Industry-leading noise canceling over-ear headphones with 8 microphones, Auto NC Optimizer, and 30-hour battery life.',
    productType: 'physical',
    category: 'Electronics',
    subcategory: 'Audio',
    useCases: ['Deep work in open offices', 'Coffee shop focus', 'Frequent air travel'],
    bestFor: 'Knowledge workers requiring deep distraction-free acoustic focus.',
    notFor: 'Intense sweaty gym workouts (not water/sweat rated for sports).',
    features: [
      'Dual processor V1 and HD Noise Canceling Processor QN1',
      '8 microphones engineered for call clarity and noise nulling',
      '30-hour battery life with 3-minute quick charge for 3 hours playback',
      'Multipoint connection to switch between phone and laptop'
    ],
    benefits: [
      'Eliminates coffee shop chatter and HVAC hum almost entirely',
      'Ultra-lightweight synthetic leather headband with gentle clamping force'
    ],
    limitations: [
      'Earcups fold flat but headband does not collapse inward like the previous XM4',
      'Premium price tier'
    ],
    officialUrl: 'https://www.sony.com',
    sourceProvider: 'Amazon Associates',
    sourceProductId: 'B09XS7JWHH',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Retailer Feed',
    imageLicense: 'Official Affiliate Feed',
    altText: 'Black Sony WH-1000XM5 wireless noise cancelling headphones on neutral background',
    region: ['Global'],
    language: 'en',
    status: 'active',
    editorialNotes: 'Unrivaled noise cancellation for deep work sprint sessions.',
    handsOnTested: true,
    editorialConfidence: 'High',
    editorialBadge: 'Editor’s Choice',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-03-16T15:00:00Z'
  },
  {
    id: 'prod-4',
    slug: 'fellow-stagg-ekg-electric-kettle',
    name: 'Fellow Stagg EKG Electric Gooseneck Kettle',
    brand: 'Fellow',
    description: 'Precision pour-over electric kettle with variable temperature control and a counterbalanced minimalist handle.',
    productType: 'physical',
    category: 'Lifestyle',
    subcategory: 'Kitchen & Coffee',
    useCases: ['Morning pour-over rituals', 'Precision green/herbal tea brewing'],
    bestFor: 'Coffee enthusiasts and home office workers who value kitchen craft and exact water temperature.',
    notFor: 'Large families needing rapid boiling of 2+ liters of water at once (0.9L capacity).',
    features: [
      'Degree-by-degree temperature control (135°F to 212°F / 57°C to 100°C)',
      'Built-in LCD screen showing target and real-time temperatures',
      '60-minute temperature hold mode',
      'Fluted gooseneck spout for controlled laminar water flow'
    ],
    benefits: [
      'Prevents bitter over-extraction by dialing in exact temperatures',
      'Stunning matte design elevates any kitchen or coffee station'
    ],
    limitations: [
      'Capacity limited to 0.9 liters',
      'Premium investment for a single-appliance kettle'
    ],
    officialUrl: 'https://fellowproducts.com',
    sourceProvider: 'Direct Brand',
    sourceProductId: 'STAGG-EKG-BLK',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Brand Press Kit',
    imageLicense: 'Merchant Press Kit',
    altText: 'Matte black Fellow Stagg EKG gooseneck kettle resting on heating base',
    region: ['US', 'CA', 'UK'],
    language: 'en',
    status: 'active',
    editorialNotes: 'The definitive pour-over kettle for precision and aesthetic pleasure.',
    handsOnTested: true,
    editorialConfidence: 'High',
    createdAt: '2026-01-22T12:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z'
  },
  {
    id: 'prod-5',
    slug: 'notion-freelance-operating-system',
    name: 'The Freelancer OS: Notion Workspace Architecture',
    brand: 'Creator Craft Labs',
    description: 'An all-in-one Notion workspace tailored for solo operators, agency freelancers, and consultants to manage clients, contracts, invoices, and deliverables.',
    productType: 'digital',
    category: 'Productivity',
    subcategory: 'Notion Templates',
    useCases: ['Client pipeline tracking', 'Project scope creep prevention', 'Tax expense logs'],
    bestFor: 'Independent consultants and freelancers wanting structure without expensive CRM monthly fees.',
    notFor: 'Large teams needing granular permission controls across 50+ members.',
    features: [
      'Pre-built CRM with automated proposal-to-project status pipelines',
      'Invoicing tracker with tax quarterly estimate calculators',
      'Client onboarding portal template with read-only client views',
      'Contract clause checklist and scope document templates'
    ],
    benefits: [
      'One-time payment with zero ongoing subscription software fees',
      'Instant duplicate into your private Notion account with setup video walkthrough'
    ],
    limitations: [
      'Requires a free or paid Notion account to operate'
    ],
    officialUrl: 'https://gumroad.com',
    sourceProvider: 'Gumroad',
    sourceProductId: 'freelance-os-notion',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Creator Authorized Assets',
    imageLicense: 'Creator Authorized',
    altText: 'Clean digital dashboard mockup showing client pipeline and revenue tracker on laptop',
    region: ['Global'],
    language: 'en',
    status: 'active',
    editorialNotes: 'Exceptional organization system for solo service businesses.',
    handsOnTested: true,
    editorialConfidence: 'High',
    editorialBadge: 'Best Value',
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z'
  },
  {
    id: 'prod-6',
    slug: 'anker-511-nano-3-charger-30w',
    name: 'Anker 511 Nano 3 30W GaN Wall Charger',
    brand: 'Anker',
    description: 'Ultra-compact 30W USB-C GaN fast wall charger with foldable prongs, capable of charging MacBooks, iPads, and iPhones at full speed.',
    productType: 'physical',
    category: 'Electronics',
    subcategory: 'Power & Cables',
    useCases: ['Everyday backpack carry', 'Minimalist travel setup', 'Bedside fast charging'],
    bestFor: 'Anyone wanting to replace multiple bulky OEM power bricks with one tiny charger.',
    notFor: 'High-power 16-inch laptops under full GPU load requiring 100W+ sustained draw.',
    features: [
      'Gallium Nitride (GaN) semiconductor architecture',
      'Foldable wall prongs for scratch-free pocket and bag carry',
      'ActiveShield 2.0 dynamic temperature monitoring',
      'Universal Power Delivery (PD 3.0 / PPS) compatibility'
    ],
    benefits: [
      '70% smaller than standard Apple 30W power adapters',
      'Rapid charges an iPhone from 0 to 50% in roughly 25 minutes'
    ],
    limitations: [
      'Single USB-C port (cannot charge phone and tablet simultaneously)'
    ],
    officialUrl: 'https://www.anker.com',
    sourceProvider: 'Amazon Associates',
    sourceProductId: 'B09W2PNLX7',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Verified Retailer Feed',
    imageLicense: 'Official Affiliate Feed',
    altText: 'Compact Anker Nano 3 wall charger plugged into wall with USB-C cable',
    region: ['Global'],
    language: 'en',
    status: 'active',
    editorialNotes: 'The definitive pocket fast charger. Permanent item in our daily travel bag.',
    handsOnTested: true,
    editorialConfidence: 'High',
    editorialBadge: 'Top Practical Pick',
    createdAt: '2026-02-05T09:00:00Z',
    updatedAt: '2026-03-17T11:00:00Z'
  },
  {
    id: 'prod-7',
    slug: 'roost-v3-ultra-portable-laptop-stand',
    name: 'Roost V3 Ultra-Portable Laptop Stand',
    brand: 'Roost',
    description: 'Extremely lightweight, height-adjustable, collapsible carbon-fiber reinforced laptop stand for healthy neck posture.',
    productType: 'physical',
    category: 'Home Office',
    subcategory: 'Ergonomics',
    useCases: ['Coffee shop work', 'Digital nomad co-working', 'Hot-desking'],
    bestFor: 'Mobile workers suffering from neck strain while looking down at laptop screens.',
    notFor: 'People who do not carry an external keyboard and mouse (not meant for direct laptop typing).',
    features: [
      'Patented one-motion folding mechanism',
      'Three height adjustment settings (6 to 11 inches elevation)',
      'Structural glass-filled nylon and medical-grade silicone pivot grips',
      'Weighs only 5.8 ounces (164 grams)'
    ],
    benefits: [
      'Brings the top of your laptop screen directly to eye level',
      'Collapses into a baton-thin profile fitting into any backpack water bottle pocket'
    ],
    limitations: [
      'Requires using an external keyboard and mouse',
      'Higher price point than stamped sheet metal stationary stands'
    ],
    officialUrl: 'https://www.therooststand.com',
    sourceProvider: 'Amazon Associates',
    sourceProductId: 'B01C9KG8IG',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Retailer Feed',
    imageLicense: 'Official Affiliate Feed',
    altText: 'Roost portable laptop stand elevating a MacBook at a coffee shop desk',
    region: ['Global'],
    language: 'en',
    status: 'active',
    editorialNotes: 'Essential ergonomic gear for any laptop worker on the move.',
    handsOnTested: true,
    editorialConfidence: 'High',
    createdAt: '2026-02-08T13:00:00Z',
    updatedAt: '2026-03-16T17:00:00Z'
  },
  {
    id: 'prod-8',
    slug: 'rhodia-webnotebook-dot-grid-a5',
    name: 'Rhodia Webnotebook A5 Dot Grid (Webbie)',
    brand: 'Rhodia',
    description: 'French-made hardcover notebook featuring 90g Clairefontaine brushed vellum paper compatible with fountain pens and rollerballs.',
    productType: 'physical',
    category: 'Everyday Essentials',
    subcategory: 'Notebooks & Stationery',
    useCases: ['Daily brain dumps', 'Bullet journaling', 'Deep thinking away from screens'],
    bestFor: 'Writers, analog thinkers, and bullet journalers who hate ink bleed-through.',
    notFor: 'People who only take notes digitally.',
    features: [
      '90g ivory Clairefontaine smooth brushed vellum paper',
      'Leatherette Italian hardcover with rounded corners',
      'Expandable inner rear pocket and ribbon bookmark',
      '96 micro-perforated dot grid sheets (192 pages)'
    ],
    benefits: [
      'Zero ink feathering or bleed-through even with wet fountain pen nibs',
      'Lies completely flat on a desk when opened'
    ],
    limitations: [
      'Ink dry times are slightly longer due to dense, non-absorbent paper coating'
    ],
    officialUrl: 'https://rhodiapads.com',
    sourceProvider: 'Amazon Associates',
    sourceProductId: 'B002A99K8C',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    imageSource: 'Verified Retailer Feed',
    imageLicense: 'Official Affiliate Feed',
    altText: 'Black Rhodia Webnotebook opened with fountain pen lying on dot-grid pages',
    region: ['Global'],
    language: 'en',
    status: 'active',
    editorialNotes: 'The smoothest paper we have written on for daily analog planning.',
    handsOnTested: true,
    editorialConfidence: 'High',
    editorialBadge: 'Top Practical Pick',
    createdAt: '2026-02-10T16:00:00Z',
    updatedAt: '2026-03-14T12:00:00Z'
  }
];

export const MERCHANT_OFFERS: MerchantOffer[] = [
  {
    id: 'off-1',
    productId: 'prod-1',
    merchantName: 'Amazon',
    providerName: 'Amazon Associates',
    affiliateProgram: 'prog-amazon',
    originalUrl: 'https://www.amazon.com/dp/B07DP7RYXV',
    affiliateUrl: 'https://www.amazon.com/dp/B07DP7RYXV?tag=everyagedigital-20',
    currency: 'USD',
    price: 139.00,
    originalPrice: 149.00,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['US', 'CA', 'UK'],
    shippingNote: 'Free Prime shipping available',
    lastCheckedAt: '2026-03-20T08:30:00Z', // Recent (current)
    staleAfterDays: 7,
    active: true
  },
  {
    id: 'off-2',
    productId: 'prod-2',
    merchantName: 'Amazon',
    providerName: 'Amazon Associates',
    affiliateProgram: 'prog-amazon',
    originalUrl: 'https://www.amazon.com/dp/B09HM94VDS',
    affiliateUrl: 'https://www.amazon.com/dp/B09HM94VDS?tag=everyagedigital-20',
    currency: 'USD',
    price: 99.99,
    originalPrice: 109.99,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['Global'],
    shippingNote: 'In stock and ships immediately',
    lastCheckedAt: '2026-03-21T06:00:00Z', // Current
    staleAfterDays: 7,
    active: true
  },
  {
    id: 'off-3',
    productId: 'prod-3',
    merchantName: 'Amazon',
    providerName: 'Amazon Associates',
    affiliateProgram: 'prog-amazon',
    originalUrl: 'https://www.amazon.com/dp/B09XS7JWHH',
    affiliateUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=everyagedigital-20',
    currency: 'USD',
    price: 398.00,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['Global'],
    shippingNote: 'Free international delivery available',
    lastCheckedAt: '2026-01-05T00:00:00Z', // INTENTIONALLY STALE (>75 days ago) to demonstrate fallback!
    staleAfterDays: 14,
    complianceNotes: 'Price check overdue. Prompt user to check merchant page.',
    active: true
  },
  {
    id: 'off-4',
    productId: 'prod-4',
    merchantName: 'Direct Brand',
    providerName: 'Direct Brand',
    affiliateProgram: 'prog-impact',
    originalUrl: 'https://fellowproducts.com/products/stagg-ekg-electric-pour-over-kettle',
    affiliateUrl: 'https://fellowproducts.com/products/stagg-ekg-electric-pour-over-kettle?utm_source=everyagedigital',
    currency: 'USD',
    price: 165.00,
    originalPrice: 195.00,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['US', 'CA'],
    shippingNote: 'Free US domestic ground shipping on orders over $75',
    lastCheckedAt: '2026-03-19T14:00:00Z',
    staleAfterDays: 10,
    active: true
  },
  {
    id: 'off-5',
    productId: 'prod-5',
    merchantName: 'Gumroad',
    providerName: 'Gumroad',
    affiliateProgram: 'prog-gumroad',
    originalUrl: 'https://creatorcraft.gumroad.com/l/freelance-os',
    affiliateUrl: 'https://creatorcraft.gumroad.com/l/freelance-os/everyagedigital',
    currency: 'USD',
    price: 49.00,
    priceType: 'fixed',
    availability: 'digital_instant',
    region: ['Global'],
    shippingNote: 'Instant digital duplicate to your Notion workspace',
    lastCheckedAt: '2026-03-18T10:00:00Z',
    staleAfterDays: 30,
    active: true
  },
  {
    id: 'off-6',
    productId: 'prod-6',
    merchantName: 'Amazon',
    providerName: 'Amazon Associates',
    affiliateProgram: 'prog-amazon',
    originalUrl: 'https://www.amazon.com/dp/B09W2PNLX7',
    affiliateUrl: 'https://www.amazon.com/dp/B09W2PNLX7?tag=everyagedigital-20',
    currency: 'USD',
    price: 22.99,
    originalPrice: 25.99,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['Global'],
    shippingNote: 'Prime 1-day delivery',
    lastCheckedAt: '2026-03-21T07:15:00Z',
    staleAfterDays: 7,
    active: true
  },
  {
    id: 'off-7',
    productId: 'prod-7',
    merchantName: 'Amazon',
    providerName: 'Amazon Associates',
    affiliateProgram: 'prog-amazon',
    originalUrl: 'https://www.amazon.com/dp/B01C9KG8IG',
    affiliateUrl: 'https://www.amazon.com/dp/B01C9KG8IG?tag=everyagedigital-20',
    currency: 'USD',
    price: 89.95,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['Global'],
    shippingNote: 'Carrying pouch included',
    lastCheckedAt: '2026-03-20T10:00:00Z',
    staleAfterDays: 7,
    active: true
  },
  {
    id: 'off-8',
    productId: 'prod-8',
    merchantName: 'Amazon',
    providerName: 'Amazon Associates',
    affiliateProgram: 'prog-amazon',
    originalUrl: 'https://www.amazon.com/dp/B002A99K8C',
    affiliateUrl: 'https://www.amazon.com/dp/B002A99K8C?tag=everyagedigital-20',
    currency: 'USD',
    price: 26.50,
    priceType: 'fixed',
    availability: 'in_stock',
    region: ['Global'],
    shippingNote: 'Available in dot grid, lined, and graph formats',
    lastCheckedAt: '2026-03-19T11:00:00Z',
    staleAfterDays: 14,
    active: true
  }
];

export const OWNED_PRODUCTS: OwnedProduct[] = [
  {
    id: 'own-1',
    slug: 'solo-creator-operating-system',
    title: 'The Solo Creator Operating System',
    tagline: 'A field-tested playbook, Notion database, and workflow architecture for independent digital builders.',
    description: 'Designed and published directly by EveryAge Digital. Combines 40+ modular templates for idea validation, content calendars, monetization pipelines, and sprint management. Includes annotated PDF guide and instant Notion duplicate link.',
    productType: 'digital',
    price: 39.00,
    currency: 'USD',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    includedItems: [
      '128-page PDF Guidebook (formatted for desktop & tablet reading)',
      'Full Notion Workspace Architecture with interconnected relational databases',
      '10 Proven Cold Outreach & Brand Partnership Email Scripts',
      'Quarterly Revenue and Tax Expense Calculator Spreadsheet (Google Sheets & Excel)'
    ],
    fileFormat: 'PDF + Notion Workspace + XLSX',
    pageCountOrModules: '128 Pages & 6 Connected Databases',
    checkoutUrl: '/shop/own-products/solo-creator-operating-system',
    paymentProvider: 'Demo',
    refundPolicy: '30-day no-questions-asked refund policy. If it does not save you 10 hours in your first month, email us for a full refund.',
    targetAudience: 'Creators, solo founders, and newsletter writers looking to scale without hiring a full team.',
    status: 'active',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-15T00:00:00Z'
  },
  {
    id: 'own-2',
    slug: 'remote-freelance-pricing-contract-kit',
    title: 'Freelance Pricing & Contract Defense Kit',
    tagline: 'Practical legal clauses, value-based pricing frameworks, and scope creep protection.',
    description: 'Crafted by our editorial staff in consultation with seasoned commercial contract paralegals. Learn how to quote projects with confidence, collect milestone deposits, and prevent unpaid scope expansions.',
    productType: 'pdf_guide',
    price: 29.00,
    currency: 'USD',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    includedItems: [
      'Plain-English Master Service Agreement Template (Word & Google Docs)',
      'Scope Creep Change Order Protocol & Email Responses',
      'Value-Based Pricing Matrix & Hourly Rate Conversion Calculator',
      'Late Payment Escalation Sequence & Letter of Demand Templates'
    ],
    fileFormat: 'PDF + DOCX Editable Templates',
    pageCountOrModules: '74 Pages & 8 Ready-to-use Legal Templates',
    checkoutUrl: '/shop/own-products/remote-freelance-pricing-contract-kit',
    paymentProvider: 'Demo',
    refundPolicy: '14-day direct refund guarantee. Email support@everyagedigital.com with your receipt.',
    targetAudience: 'Designers, copywriters, developers, and consultants working directly with private clients.',
    status: 'active',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-03-18T00:00:00Z'
  }
];

export const BOOKS: Book[] = [
  {
    id: 'book-1',
    slug: 'deep-work-cal-newport',
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    format: 'Paperback / Hardcover',
    description: 'One of the most foundational texts on modern knowledge work. Argues that the ability to focus without distraction is becoming increasingly rare and simultaneously increasingly valuable in our economy.',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1455586692.01.LZZZZZZZ.jpg',
    imageLicense: 'Official Publisher Feed',
    merchant: 'Amazon',
    affiliateUrl: 'https://www.amazon.com/dp/1455586692?tag=everyagedigital-20',
    owned: false,
    price: 18.99,
    currency: 'USD',
    lastCheckedAt: '2026-03-18T10:00:00Z',
    disclosureRequired: true,
    status: 'active',
    difficulty: 'Beginner',
    targetAudience: 'Anyone struggling to maintain uninterrupted focus in modern notifications-heavy environments.',
    keyLearnings: [
      'The 4 Deep Work philosophies: Monastic, Bimodal, Rhythmic, and Journalistic',
      'Why open offices and constant connectivity sabotage high-value cognitive output',
      'Actionable daily rituals to train your concentration and resist distraction urges'
    ],
    relatedProductIds: ['prod-1', 'prod-3', 'prod-8']
  },
  {
    id: 'book-2',
    slug: 'the-personal-mba-josh-kaufman',
    title: 'The Personal MBA: Master the Art of Business',
    author: 'Josh Kaufman',
    format: 'Paperback / Hardcover',
    description: 'A comprehensive distillation of the universal principles of business—value creation, marketing, sales, value delivery, and finance—without taking on $150k in business school tuition.',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1591845572.01.LZZZZZZZ.jpg',
    imageLicense: 'Official Publisher Feed',
    merchant: 'Amazon',
    affiliateUrl: 'https://www.amazon.com/dp/1591845572?tag=everyagedigital-20',
    owned: false,
    price: 19.49,
    currency: 'USD',
    lastCheckedAt: '2026-03-19T11:00:00Z',
    disclosureRequired: true,
    status: 'active',
    difficulty: 'Comprehensive',
    targetAudience: 'Self-taught founders, freelancers, and engineers wanting a firm grasp of commercial business logic.',
    keyLearnings: [
      'The 5 Core Parts of Every Business: Value Creation, Marketing, Sales, Value Delivery, Finance',
      'The 12 Standard Forms of Value and how to choose the right model',
      'Cognitive biases that systematically impair executive decision making'
    ],
    relatedProductIds: ['prod-5']
  },
  {
    id: 'book-3',
    slug: 'atomic-habits-james-clear',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    author: 'James Clear',
    format: 'Paperback / Hardcover',
    description: 'A practical framework for improving every day by 1%. Explores how tiny changes in behavior lead to remarkable compounding results over months and years.',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0735211299.01.LZZZZZZZ.jpg',
    imageLicense: 'Official Publisher Feed',
    merchant: 'Amazon',
    affiliateUrl: 'https://www.amazon.com/dp/0735211299?tag=everyagedigital-20',
    owned: false,
    price: 14.99,
    currency: 'USD',
    lastCheckedAt: '2026-03-20T09:00:00Z',
    disclosureRequired: true,
    status: 'active',
    difficulty: 'Beginner',
    targetAudience: 'Anyone wanting to eliminate unproductive friction and build enduring personal or professional routines.',
    keyLearnings: [
      'The Four Laws of Behavior Change: Make it Obvious, Attractive, Easy, and Satisfying',
      'How to design your physical environment to make good habits inevitable and bad habits difficult',
      'Identity-based habit formation: focusing on who you wish to become rather than just what you want to achieve'
    ],
    relatedProductIds: ['prod-8']
  },
  {
    id: 'book-4',
    slug: 'show-your-work-austin-kleon',
    title: 'Show Your Work!: 10 Ways to Share Your Creativity and Get Discovered',
    author: 'Austin Kleon',
    format: 'Ebook / Kindle',
    description: 'A short, punchy manual on how to build an audience by generously sharing your daily process, experiments, and unfinished drafts rather than waiting for finished perfection.',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/076117897X.01.LZZZZZZZ.jpg',
    imageLicense: 'Publisher Feed',
    merchant: 'Amazon',
    affiliateUrl: 'https://www.amazon.com/dp/076117897X?tag=everyagedigital-20',
    owned: false,
    price: 9.99,
    currency: 'USD',
    lastCheckedAt: '2026-03-19T15:00:00Z',
    disclosureRequired: true,
    status: 'active',
    difficulty: 'Beginner',
    targetAudience: 'Introverted creatives, writers, and builders who hate self-promotion and bragging.',
    keyLearnings: [
      'Think process, not product: become a documentarian of your own craft',
      'Share something small every single day to let serendipity compound',
      'Build a digital cabinet of curiosities and credit your sources with integrity'
    ],
    relatedProductIds: ['prod-5', 'own-1']
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    slug: 'home-office-starter-kit',
    title: 'The Calm Home Office Starter Kit',
    subtitle: 'Ergonomic, distraction-free essentials for remote professionals and builders.',
    introduction: 'Working from home shouldn’t mean neck stiffness, tangled cables, and tired eyes. This collection brings together our highest-tested desk illumination, ergonomic mouse, and posture elevation tools.',
    selectionCriteria: [
      'Must have undergone at least 3 months of daily hands-on editorial testing',
      'Must prioritize physical ergonomics and space conservation',
      'Must offer durable materials and verifiable manufacturer warranties'
    ],
    productIds: ['prod-1', 'prod-2', 'prod-7'],
    bookIds: ['book-1'],
    coverImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    lastReviewedAt: '2026-03-18T12:00:00Z',
    status: 'published'
  },
  {
    id: 'col-2',
    slug: 'digital-products-for-freelancers',
    title: 'Digital Systems for Solo Freelancers',
    subtitle: 'High-leverage templates, contracts, and pipelines that replace recurring SaaS subscriptions.',
    introduction: 'Running a solo service business requires clear contracts and disciplined client workflows. We hand-picked digital resources and guides that give you agency-grade operations from day one.',
    selectionCriteria: [
      'One-time purchase models (no forced monthly recurring subscription fees)',
      'Immediate instant download or workspace duplication',
      'Direct practical relevance to solo pricing, client retention, and scope protection'
    ],
    productIds: ['prod-5'],
    bookIds: ['book-2', 'book-4'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    lastReviewedAt: '2026-03-19T10:00:00Z',
    status: 'published'
  },
  {
    id: 'col-3',
    slug: 'everyday-essentials',
    title: 'Everyday Essentials & Analog Tools',
    subtitle: 'Tactile, reliable items built for daily utility and focus.',
    introduction: 'In an era dominated by glowing screens, high-grade analog writing instruments and reliable everyday charging gear anchor our morning routines and deep work sessions.',
    selectionCriteria: [
      'Compact footprint suitable for everyday carry or minimalist nightstands',
      'Timeless durability and verified performance standards',
      'High price-to-utility ratio'
    ],
    productIds: ['prod-6', 'prod-8', 'prod-4'],
    bookIds: ['book-3'],
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    lastReviewedAt: '2026-03-20T14:00:00Z',
    status: 'published'
  },
  {
    id: 'col-4',
    slug: 'books-for-learning-business',
    title: 'Books for Learning Real Business & Focus',
    subtitle: 'Timeless reading material to build commercial skills and cognitive stamina.',
    introduction: 'Skip buzzword-heavy business airport books. We curated foundational texts that sharpen your understanding of focus, economics, habits, and generative audience building.',
    selectionCriteria: [
      'Actionable frameworks backed by evidence or proven case studies',
      'High reread value over multiple career phases',
      'Endorsed by working practitioners across tech, design, and commerce'
    ],
    productIds: ['prod-5'],
    bookIds: ['book-1', 'book-2', 'book-3', 'book-4'],
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    lastReviewedAt: '2026-03-21T09:00:00Z',
    status: 'published'
  }
];

export const SOURCE_EVIDENCES: SourceEvidence[] = [
  {
    id: 'ev-1',
    productId: 'prod-1',
    sourceUrl: 'https://www.benq.com/en-us/lighting/monitor-light/screenbar-plus/spec.html',
    sourceType: 'Manufacturer Specs',
    quote: 'Asymmetric Optical Design illuminates the desk without any reflective glare on the screen. Illuminance: 1000 Lux in the center.',
    retrievedAt: '2026-02-10T12:00:00Z',
    confidence: 'High'
  },
  {
    id: 'ev-2',
    productId: 'prod-2',
    sourceUrl: 'https://www.logitech.com/en-us/products/mice/mx-master-3s/specifications.html',
    sourceType: 'Manufacturer Specs',
    quote: 'Sensor Technology: Darkfield high precision. Nominal value: 1000 DPI. DPI (Minimal and maximal value): 200 to 8000 DPI (can be set in increments of 50 DPI).',
    retrievedAt: '2026-02-12T10:00:00Z',
    confidence: 'High'
  },
  {
    id: 'ev-3',
    productId: 'prod-3',
    sourceUrl: 'https://www.sony.com/electronics/headband-headphones/wh-1000xm5/specifications',
    sourceType: 'Manufacturer Specs',
    quote: 'Battery Life (continuous music playback): Max. 30 hrs (NC ON), Max. 40 hrs (NC OFF). Charging method: USB.',
    retrievedAt: '2026-02-14T09:00:00Z',
    confidence: 'High'
  }
];
