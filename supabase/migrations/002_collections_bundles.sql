-- Supabase / PostgreSQL Migration for Collections and Bundles
-- Migration: 002_collections_bundles.sql

-- 1. Ensure collections table has required fields
ALTER TABLE collections ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 2. Create collection_products table if not exists
CREATE TABLE IF NOT EXISTS collection_products (
  collection_id VARCHAR(64) NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id VARCHAR(64) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, product_id)
);

-- 3. Clean orphaned rows (where product_id does not exist in products table)
DELETE FROM collection_products WHERE product_id NOT IN (SELECT id FROM products);

-- 4. Enforce cascade foreign key constraint
ALTER TABLE collection_products DROP CONSTRAINT IF EXISTS fk_product;
ALTER TABLE collection_products ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- 5. Helpful indices
CREATE INDEX IF NOT EXISTS idx_collection_products_product ON collection_products(product_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_collection ON collection_products(collection_id);
