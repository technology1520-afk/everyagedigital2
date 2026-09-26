-- Supabase / PostgreSQL Migration for Collections and Bundles
-- Migration: 002_collections_bundles.sql

-- 1. Ensure collections table has required fields
ALTER TABLE collections ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 2. Create collection_products table
CREATE TABLE IF NOT EXISTS collection_products (
  collection_id VARCHAR(64) NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, product_id),
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 3. Helpful indices
CREATE INDEX IF NOT EXISTS idx_collection_products_product ON collection_products(product_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_collection ON collection_products(collection_id);
