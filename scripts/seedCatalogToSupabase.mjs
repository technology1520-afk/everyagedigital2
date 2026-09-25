import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wlfwdbusmzgdiryhtdki.supabase.co')
  .replace(/^["']|["']$/g, '')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

if (!supabaseKey) {
  console.error('[seedCatalog] Error: SUPABASE_SERVICE_ROLE_KEY is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS_TO_SEED = [
  {
    id: 'prod-1',
    slug: 'benq-screenbar-plus-monitor-light',
    title: 'BenQ ScreenBar Plus Monitor Light',
    brand: 'BenQ',
    description: 'An auto-dimming e-reading monitor lamp with an external desktop dial that balances desk illumination without creating screen glare.',
    price_min: 139.00,
    price_max: 149.00,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: false,
    editorial_badge: "Editor's Choice",
    best_for: 'Late-night writing, dual-monitor productivity, and glare-sensitive eyes.',
    not_for: 'Users looking for a traditional tall swinging desk arm.',
    features: ['Auto-dimming optical sensor', 'Asymmetric optical beam pattern', 'Desktop rotary control dial'],
    limitations: ['Requires USB power source', 'Desktop dial footprint takes space'],
    affiliate_url: 'https://www.amazon.com/dp/B07DP7RYXV?tag=everyagedigital-20',
    network: 'amazon'
  },
  {
    id: 'prod-2',
    slug: 'logitech-mx-master-3s-ergonomic-mouse',
    title: 'Logitech MX Master 3S Wireless Mouse',
    brand: 'Logitech',
    description: 'Quiet click performance wireless mouse with 8K DPI track-on-glass sensor and electromagnetic MagSpeed scrolling for deep focus productivity.',
    price_min: 99.99,
    price_max: 119.99,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: false,
    editorial_badge: 'Best Value',
    best_for: 'Programmers, digital creators, and analysts navigating massive datasets.',
    not_for: 'Left-handed users (ergonomic shape is right-hand strictly).',
    features: ['8000 DPI sensor tracking on glass', 'MagSpeed electromagnetic scrolling', 'Quiet click acoustic reduction'],
    limitations: ['Right-handed ergonomics exclusively', 'Slightly heavy at 141 grams'],
    affiliate_url: 'https://www.amazon.com/dp/B09HM94VDS?tag=everyagedigital-20',
    network: 'amazon'
  },
  {
    id: 'prod-3',
    slug: 'sony-wh-1000xm5-noise-canceling-headphones',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    description: 'Industry-leading noise canceling headphones with dual processors and 8 microphones for noise isolation in open-plan offices and travel.',
    price_min: 398.00,
    price_max: 449.99,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: false,
    editorial_badge: "Editor's Choice",
    best_for: 'Remote workers in noisy environments, deep thinkers, and frequent travelers.',
    not_for: 'Users looking for foldable headphones that tuck into tiny pockets.',
    features: ['Auto NC Optimizer', '30-hour battery life with fast charging', 'Ultra-comfortable lightweight fit'],
    limitations: ['Earcups fold flat but do not collapse inward', 'Expensive investment price'],
    affiliate_url: 'https://www.amazon.com/dp/B09XS7JWHH?tag=everyagedigital-20',
    network: 'amazon'
  },
  {
    id: 'prod-4',
    slug: 'fellow-stagg-ekg-electric-kettle',
    title: 'Fellow Stagg EKG Electric Gooseneck Kettle',
    brand: 'Fellow',
    description: 'Precision pour-over electric kettle with variable temperature control, 1200W quick heating, and a 60-minute temperature hold function.',
    price_min: 165.00,
    price_max: 195.00,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: false,
    editorial_badge: 'Top Practical Pick',
    best_for: 'Coffee connoisseurs and morning ritual enthusiasts desiring exact temperatures.',
    not_for: 'Big households needing 2+ liters of boiling water instantly.',
    features: ['To-the-degree temperature control', 'Fluted gooseneck pour spout', 'High-res LCD display'],
    limitations: ['0.9 liter volume limit', 'Stainless steel exterior gets hot'],
    affiliate_url: 'https://www.amazon.com/dp/B077JBQZPX?tag=everyagedigital-20',
    network: 'amazon'
  },
  {
    id: 'prod-5',
    slug: 'notion-freelance-operating-system',
    title: 'The Freelancer OS: Notion Workspace Architecture',
    brand: 'EveryAge Digital',
    description: 'A complete Notion operating system for solo operators: client pipelines, invoice registers, contract vaults, and sprint planners.',
    price_min: 49.00,
    price_max: 79.00,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: true,
    editorial_badge: 'Creator Favorite',
    best_for: 'Freelancers, consultants, and solo founders managing 3-10 active client engagements.',
    not_for: 'Teams with 15+ employees requiring complex enterprise permission hierarchies.',
    features: ['1-click Notion workspace duplicate', 'Automated project sprint boards', 'Client portal dashboards'],
    limitations: ['Requires a Notion account (free or paid)'],
    affiliate_url: 'https://everyagedigital.gumroad.com/l/freelancer-os',
    network: 'gumroad'
  },
  {
    id: 'prod-6',
    slug: 'anker-511-nano-3-charger-30w',
    title: 'Anker 511 Nano 3 30W GaN Wall Charger',
    brand: 'Anker',
    description: 'Ultra-compact 30W USB-C GaN fast charger with foldable prongs, capable of powering an iPad Air or MacBook Air from a plug smaller than a golf ball.',
    price_min: 22.99,
    price_max: 29.99,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: false,
    editorial_badge: 'Best Value',
    best_for: 'Digital nomads, café workers, and travelers needing minimal pocket weight.',
    not_for: 'High-draw 16-inch laptops requiring 100W+ under full video rendering loads.',
    features: ['Foldable plug design', 'GaN (Gallium Nitride) technology', 'Dynamic temperature monitoring'],
    limitations: ['Single USB-C output port'],
    affiliate_url: 'https://www.amazon.com/dp/B09W2PNLX7?tag=everyagedigital-20',
    network: 'amazon'
  },
  {
    id: 'prod-7',
    slug: 'roost-v3-ultra-portable-laptop-stand',
    title: 'Roost V3 Ultra-Portable Laptop Stand',
    brand: 'Roost',
    description: 'The definitive collapsible ergonomic laptop stand. Folds into a compact baton while elevating screens 6 to 14 inches to align eye level.',
    price_min: 89.95,
    price_max: 95.00,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: false,
    editorial_badge: 'Top Practical Pick',
    best_for: 'Remote workers experiencing neck fatigue during laptop work outside the home office.',
    not_for: 'Desk setups that never move and prefer heavy aluminum fixed stands.',
    features: ['7 height adjustment settings', 'Ultra-lightweight 5.8 oz composite', 'One-motion rapid fold mechanism'],
    limitations: ['Requires external keyboard and mouse for proper ergonomics'],
    affiliate_url: 'https://www.amazon.com/dp/B01C9KG8IG?tag=everyagedigital-20',
    network: 'amazon'
  },
  {
    id: 'prod-8',
    slug: 'rhodia-webnotebook-dot-grid-a5',
    title: 'Rhodia Webnotebook A5 Dot Grid (Webbie)',
    brand: 'Rhodia',
    description: 'Premium French-milled 90g Clairfontaine ivory paper notebook with faux leather hard cover, designed to resist fountain pen bleeding.',
    price_min: 24.50,
    price_max: 28.00,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    is_owned: false,
    editorial_badge: 'Creator Favorite',
    best_for: 'Thinkers, journalers, and bullet-system operators who love tactile writing.',
    not_for: 'Digital-only note takers who discard physical books.',
    features: ['90 gsm Clairefontaine vellum paper', 'Smooth non-bleeding ink absorption', 'Inner expanding pocket & ribbon marker'],
    limitations: ['Fixed pages cannot be rearranged'],
    affiliate_url: 'https://www.amazon.com/dp/B002A9CKW4?tag=everyagedigital-20',
    network: 'amazon'
  },
  // Keychron Q1 Pro — requested explicitly by user:
  {
    id: 'prod-1790216245503',
    slug: 'keychron-q1-pro-wireless-custom-mechanical-keyboard',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    brand: 'Keychron',
    description: 'QMK/VIA wireless custom mechanical keyboard with 75% layout, CNC machined aluminum body, double-gasket design, and hot-swappable switches for quiet and ergonomic desk productivity.',
    price_min: 199.99,
    price_max: 219.99,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    status: 'draft',
    is_owned: false,
    editorial_badge: "Editor's Choice",
    best_for: 'Keyboard enthusiasts, software engineers, and writers demanding acoustic satisfaction.',
    not_for: 'Users looking for a lightweight plastic keyboard to carry in a backpack.',
    features: ['QMK/VIA programmable keymaps', 'Bluetooth 5.1 & Type-C wired', 'Hot-swappable K Pro mechanical switches', 'Full CNC machined aluminum body'],
    limitations: ['Substantial weight (approx 1.7kg) limits mobility'],
    affiliate_url: 'https://www.amazon.com/dp/B0B551TEST?tag=everyagedigital-20',
    network: 'amazon'
  }
];

async function seed() {
  console.log(`[seedCatalog] Starting seed to Supabase at ${supabaseUrl}...`);

  for (const item of PRODUCTS_TO_SEED) {
    const { affiliate_url, network, ...prodRow } = item;
    const now = new Date().toISOString();
    const row = {
      ...prodRow,
      category_id: null,
      merchant_id: null,
      created_at: now,
      updated_at: now
    };

    // Upsert product
    const { data: pData, error: pError } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (pError) {
      console.error(`[seedCatalog] Failed product ${item.id} (${item.title}):`, pError.message);
    } else {
      console.log(`[seedCatalog] Upserted product ${item.id}: ${item.title}`);

      // Upsert affiliate link
      if (affiliate_url) {
        const linkRow = {
          id: `link-${item.id}`,
          product_id: item.id,
          network: network || 'amazon',
          url: affiliate_url,
          rel_tag: 'sponsored nofollow noopener',
          last_checked_at: now,
          stale_after: 7,
          click_count: 0
        };

        const { error: lError } = await supabase
          .from('affiliate_links')
          .upsert(linkRow, { onConflict: 'id' });

        if (lError) {
          console.warn(`[seedCatalog] Link warning for ${item.id}:`, lError.message);
        } else {
          console.log(`[seedCatalog]   Linked affiliate URL: ${affiliate_url.slice(0, 45)}...`);
        }
      }
    }
  }

  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`[seedCatalog] Completed. Total products in Supabase: ${count}`);
}

seed().catch(err => {
  console.error('[seedCatalog] Unexpected error:', err);
  process.exit(1);
});
