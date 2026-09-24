-- Supabase / PostgreSQL Initial Schema for EveryAge Digital
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  parent_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MERCHANTS
CREATE TABLE IF NOT EXISTS merchants (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  network VARCHAR(64) NOT NULL CHECK (network IN (
    'amazon', 'gumroad', 'clickbank', 'impact', 'cj', 'awin', 
    'shareasale', 'partnerstack', 'direct', 'owned'
  )),
  base_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(256) NOT NULL,
  description TEXT NOT NULL,
  brand VARCHAR(128),
  category_id VARCHAR(64) REFERENCES categories(id) ON DELETE RESTRICT,
  merchant_id VARCHAR(64) REFERENCES merchants(id) ON DELETE RESTRICT,
  price_min DECIMAL(10, 2),
  price_max DECIMAL(10, 2),
  currency VARCHAR(8) DEFAULT 'USD',
  image_url TEXT,
  status VARCHAR(32) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  is_owned BOOLEAN DEFAULT FALSE,
  rating_display DECIMAL(3, 2),
  editorial_badge VARCHAR(64),
  best_for TEXT,
  not_for TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  limitations JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '[]'::jsonb,
  editorial_stance TEXT,
  tested_in_house BOOLEAN DEFAULT FALSE,
  last_price_checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-Text Search Index for PostgreSQL
CREATE INDEX IF NOT EXISTS products_search_idx ON products USING GIN (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(brand, ''))
);

-- 4. AFFILIATE LINKS
CREATE TABLE IF NOT EXISTS affiliate_links (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  network VARCHAR(64) NOT NULL,
  url TEXT NOT NULL,
  rel_tag VARCHAR(64) DEFAULT 'sponsored nofollow noopener',
  last_checked_at TIMESTAMPTZ DEFAULT NOW(),
  stale_after INT DEFAULT 7, -- days
  click_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_links_product ON affiliate_links(product_id);

-- 5. COLLECTIONS
CREATE TABLE IF NOT EXISTS collections (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(256) NOT NULL,
  description TEXT,
  product_ids JSONB DEFAULT '[]'::jsonb,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(32) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLICKS (Outbound tracking analytics)
CREATE TABLE IF NOT EXISTS clicks (
  id VARCHAR(64) PRIMARY KEY,
  link_id VARCHAR(64) REFERENCES affiliate_links(id) ON DELETE CASCADE,
  product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  country VARCHAR(8) DEFAULT 'US'
);

CREATE INDEX IF NOT EXISTS idx_clicks_ts ON clicks(ts);
CREATE INDEX IF NOT EXISTS idx_clicks_product ON clicks(product_id);

-- 7. ASSISTANT LOGS (AI Shopping Receptionist)
CREATE TABLE IF NOT EXISTS assistant_logs (
  id VARCHAR(64) PRIMARY KEY,
  ts TIMESTAMPTZ DEFAULT NOW(),
  session_id VARCHAR(128) NOT NULL,
  user_message TEXT NOT NULL,
  assistant_reply TEXT NOT NULL,
  products_referenced JSONB DEFAULT '[]'::jsonb,
  is_hallucination BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_assistant_logs_ts ON assistant_logs(ts);

-- 8. OWN PRODUCTS (Extension of products for in-house digital goods)
CREATE TABLE IF NOT EXISTS own_products (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(256) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  delivery_info TEXT NOT NULL,
  refund_policy TEXT NOT NULL,
  checkout_provider VARCHAR(64) DEFAULT 'demo' CHECK (checkout_provider IN ('lemonsqueezy', 'paddle', 'demo')),
  checkout_url TEXT,
  file_format VARCHAR(64),
  included_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(256) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(32) DEFAULT 'owner' CHECK (role IN ('owner', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
