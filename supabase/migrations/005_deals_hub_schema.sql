-- Supabase / PostgreSQL Migration: 005_deals_hub_schema.sql
-- Add deal-specific columns and seed student perk

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_deal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS discount_percent INTEGER,
ADD COLUMN IF NOT EXISTS deal_type TEXT DEFAULT 'discount', -- 'freebie' | 'student' | 'hardware_clearance'
ADD COLUMN IF NOT EXISTS claim_steps JSONB,
ADD COLUMN IF NOT EXISTS deal_facts JSONB,
ADD COLUMN IF NOT EXISTS verified_date TEXT,
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS merchant TEXT,
ADD COLUMN IF NOT EXISTS affiliate_url TEXT;

-- Provide default for id if omitted in inserts
ALTER TABLE products ALTER COLUMN id SET DEFAULT ('prod-' || substr(md5(random()::text), 1, 12));

-- Insert the "Google AI Plus for Students" deal
INSERT INTO products (
  title,
  slug,
  description,
  price,
  original_price,
  discount_percent,
  is_free,
  is_deal,
  category,
  merchant,
  affiliate_url,
  verified_date,
  deal_facts,
  claim_steps,
  status
) VALUES (
  'Google AI Plus for Students - Free for 1 Year via Handshake',
  'google-ai-plus-students-free-handshake',
  'Undergraduate and graduate students get Google AI Plus free for one year through Handshake: Gemini with higher limits, access to Google Pro models, and 2TB/400GB storage. Normally $7.99–$19.99/mo.',
  0.00,
  95.88,
  100,
  true,
  true,
  'Digital Templates & Downloads',
  'Google / Handshake',
  'https://app.joinhandshake.com/gemini',
  'Verified Live',
  '{"duration": "12 Months", "discount": "100% OFF (1 Year)", "value": "$95.88/year", "access": "Student .edu / Handshake Verification"}'::jsonb,
  '[
    "Log in to Handshake at app.joinhandshake.com/gemini with your university student account.",
    "Unlock the Google AI promotional offer on your Handshake dashboard.",
    "Activate using your preferred personal or university Google account.",
    "Add a payment method on Google Play to activate (no charges apply during the 12-month free term)."
  ]'::jsonb,
  'active'
) ON CONFLICT (slug) DO UPDATE SET 
  is_deal = true, 
  is_free = true, 
  discount_percent = 100,
  price = 0.00,
  original_price = 95.88,
  deal_type = 'student',
  verified_date = 'Verified Live',
  deal_facts = '{"duration": "12 Months", "discount": "100% OFF (1 Year)", "value": "$95.88/year", "access": "Student .edu / Handshake Verification"}'::jsonb,
  claim_steps = '[
    "Log in to Handshake at app.joinhandshake.com/gemini with your university student account.",
    "Unlock the Google AI promotional offer on your Handshake dashboard.",
    "Activate using your preferred personal or university Google account.",
    "Add a payment method on Google Play to activate (no charges apply during the 12-month free term)."
  ]'::jsonb,
  status = 'active';

-- Sync price_min / price_max / features for backward compatibility
UPDATE products
SET 
  price_min = COALESCE(price_min, price),
  price_max = COALESCE(price_max, original_price),
  image_url = COALESCE(image_url, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')
WHERE slug = 'google-ai-plus-students-free-handshake';

-- Insert Creator Studio 85% Deal
INSERT INTO products (
  title,
  slug,
  description,
  price,
  original_price,
  discount_percent,
  is_free,
  is_deal,
  category,
  merchant,
  affiliate_url,
  verified_date,
  deal_facts,
  claim_steps,
  status,
  price_min,
  price_max,
  image_url
) VALUES (
  'Creator Studio Ultimate FX & Motion Suite (85% OFF Lifetime License)',
  'creator-pro-motion-sound-superpack',
  'Over 2,400+ 4K transitions, cinematic color LUTs, and lossless sound design assets for digital video creators and editors.',
  29.00,
  199.00,
  85,
  false,
  true,
  'Digital Templates & Downloads',
  'Gumroad',
  'https://creatorcraft.gumroad.com/l/motion-suite?discount=EVERYAGE85',
  'Verified Live',
  '{"duration": "Lifetime License", "discount": "85% OFF Flash Sale", "value": "$199.00 retail value", "access": "Instant Digital Download"}'::jsonb,
  '[
    "Visit the official Gumroad creator bundle checkout page.",
    "Enter the verified editorial discount code at checkout.",
    "Receive instant lifetime access and cloud asset links."
  ]'::jsonb,
  'active',
  29.00,
  199.00,
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
) ON CONFLICT (slug) DO UPDATE SET 
  is_deal = true,
  discount_percent = 85,
  price = 29.00,
  original_price = 199.00,
  verified_date = 'Verified Live';

