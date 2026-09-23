import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wlfwdbusmzgdiryhtdki.supabase.co')
  .replace(/^["']|["']$/g, '')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

if (!supabaseKey) {
  console.error('[seedBooks] Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const BOOKS_TO_SEED = [
  {
    id: 'book-1',
    slug: 'deep-work-cal-newport',
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    brand: 'Cal Newport',
    description: 'One of the most foundational texts on modern knowledge work. Argues that the ability to focus without distraction is becoming increasingly rare and simultaneously increasingly valuable in our economy.',
    category_id: 'books-guides',
    merchant_id: 'amazon',
    price_min: 18.99,
    price_max: 28.00,
    currency: 'USD',
    image_url: 'https://images-na.ssl-images-amazon.com/images/P/1455586692.01.LZZZZZZZ.jpg',
    status: 'active',
    is_owned: false,
    editorial_badge: "Editor's Choice",
    best_for: 'Anyone struggling to maintain uninterrupted focus in modern notifications-heavy environments.',
    not_for: 'Users wanting light, passive productivity tips.',
    features: [
      'Format: Paperback / Hardcover',
      'Difficulty: Beginner',
      'The 4 Deep Work philosophies: Monastic, Bimodal, Rhythmic, and Journalistic',
      'Why open offices and constant connectivity sabotage high-value cognitive output',
      'Actionable daily rituals to train your concentration and resist distraction urges'
    ],
    limitations: ['Standard merchant shipping policies apply'],
    affiliate_url: 'https://www.amazon.com/dp/1455586692?tag=everyagedigital-20'
  },
  {
    id: 'book-2',
    slug: 'the-personal-mba-josh-kaufman',
    title: 'The Personal MBA: Master the Art of Business',
    brand: 'Josh Kaufman',
    description: 'A comprehensive distillation of the universal principles of business—value creation, marketing, sales, value delivery, and finance—without taking on $150k in business school tuition.',
    category_id: 'books-guides',
    merchant_id: 'amazon',
    price_min: 19.49,
    price_max: 30.00,
    currency: 'USD',
    image_url: 'https://images-na.ssl-images-amazon.com/images/P/1591845572.01.LZZZZZZZ.jpg',
    status: 'active',
    is_owned: false,
    editorial_badge: 'Best Value',
    best_for: 'Self-taught founders, freelancers, and engineers wanting a firm grasp of commercial business logic.',
    not_for: 'Readers looking for narrow academic theory over practical business execution.',
    features: [
      'Format: Paperback / Hardcover',
      'Difficulty: Comprehensive',
      'The 5 Core Parts of Every Business: Value Creation, Marketing, Sales, Value Delivery, Finance',
      'The 12 Standard Forms of Value and how to choose the right model',
      'Cognitive biases that systematically impair executive decision making'
    ],
    limitations: ['Standard merchant shipping policies apply'],
    affiliate_url: 'https://www.amazon.com/dp/1591845572?tag=everyagedigital-20'
  },
  {
    id: 'book-3',
    slug: 'atomic-habits-james-clear',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    brand: 'James Clear',
    description: 'A practical framework for improving every day by 1%. Explores how tiny changes in behavior lead to remarkable compounding results over months and years.',
    category_id: 'books-guides',
    merchant_id: 'amazon',
    price_min: 14.99,
    price_max: 27.00,
    currency: 'USD',
    image_url: 'https://images-na.ssl-images-amazon.com/images/P/0735211299.01.LZZZZZZZ.jpg',
    status: 'active',
    is_owned: false,
    editorial_badge: "Editor's Choice",
    best_for: 'Anyone wanting to eliminate unproductive friction and build enduring personal or professional routines.',
    not_for: 'Users expecting overnight miracles without daily small improvements.',
    features: [
      'Format: Paperback / Hardcover',
      'Difficulty: Beginner',
      'The Four Laws of Behavior Change: Make it Obvious, Attractive, Easy, and Satisfying',
      'How to design your physical environment to make good habits inevitable and bad habits difficult',
      'Identity-based habit formation: focusing on who you wish to become rather than just what you want to achieve'
    ],
    limitations: ['Standard merchant shipping policies apply'],
    affiliate_url: 'https://www.amazon.com/dp/0735211299?tag=everyagedigital-20'
  },
  {
    id: 'book-4',
    slug: 'show-your-work-austin-kleon',
    title: 'Show Your Work!: 10 Ways to Share Your Creativity and Get Discovered',
    brand: 'Austin Kleon',
    description: 'A short, punchy manual on how to build an audience by generously sharing your daily process, experiments, and unfinished drafts rather than waiting for finished perfection.',
    category_id: 'books-guides',
    merchant_id: 'amazon',
    price_min: 9.99,
    price_max: 15.95,
    currency: 'USD',
    image_url: 'https://images-na.ssl-images-amazon.com/images/P/076117897X.01.LZZZZZZZ.jpg',
    status: 'active',
    is_owned: false,
    editorial_badge: 'Top Practical Pick',
    best_for: 'Introverted creatives, writers, and builders who hate self-promotion and bragging.',
    not_for: 'Creators looking for complex corporate marketing funnels.',
    features: [
      'Format: Paperback / Hardcover',
      'Difficulty: Beginner',
      'Think process, not product: become a documentarian of your own craft',
      'Share something small every single day to let serendipity compound',
      'Build a digital cabinet of curiosities and credit your sources with integrity'
    ],
    limitations: ['Standard merchant shipping policies apply'],
    affiliate_url: 'https://www.amazon.com/dp/076117897X?tag=everyagedigital-20'
  }
];

export async function seedBooks() {
  console.log(`[seedBooks] Connecting to Supabase at ${supabaseUrl}...`);

  // 1. Ensure 'books-guides' Category exists
  const { error: catError } = await supabase.from('categories').upsert({
    id: 'books-guides',
    slug: 'books-guides',
    name: 'Books & Guides',
    sort_order: 1
  });
  if (catError) {
    console.warn('[seedBooks] Category upsert warning:', catError.message);
  } else {
    console.log('[seedBooks] Verified category "Books & Guides" (id: books-guides).');
  }

  // 2. Ensure 'amazon' Merchant exists
  const { error: merchError } = await supabase.from('merchants').upsert({
    id: 'amazon',
    slug: 'amazon',
    name: 'Amazon',
    network: 'amazon',
    base_url: 'https://www.amazon.com'
  });
  if (merchError) {
    console.warn('[seedBooks] Merchant upsert warning:', merchError.message);
  } else {
    console.log('[seedBooks] Verified merchant "Amazon" (id: amazon).');
  }

  // 3. Upsert each book into 'products' and 'affiliate_links'
  for (const book of BOOKS_TO_SEED) {
    const { affiliate_url, ...productRow } = book;

    const { error: prodError } = await supabase.from('products').upsert(productRow);
    if (prodError) {
      console.error(`[seedBooks] Error upserting product ${book.title}:`, prodError.message);
      continue;
    }
    console.log(`[seedBooks] Upserted product: "${book.title}" (${book.id})`);

    if (affiliate_url) {
      const { error: linkError } = await supabase.from('affiliate_links').upsert({
        id: `link-${book.id}`,
        product_id: book.id,
        network: 'amazon',
        url: affiliate_url,
        rel_tag: 'sponsored nofollow noopener',
        stale_after: 7
      });
      if (linkError) {
        console.warn(`[seedBooks] Warning upserting link for ${book.id}:`, linkError.message);
      } else {
        console.log(`[seedBooks] Upserted affiliate link for: "${book.id}"`);
      }
    }
  }

  console.log('[seedBooks] Completed seeding all 4 curated books into Supabase products.');
}

if (process.argv[1]?.endsWith('seedBooks.mjs')) {
  seedBooks().catch((err) => {
    console.error('[seedBooks] Fatal error:', err);
    process.exit(1);
  });
}
