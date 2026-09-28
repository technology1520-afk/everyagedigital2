-- Supabase / PostgreSQL Migration: 004_collections_banner_image.sql
-- Add dedicated composite banner_image_url to collections table
-- Keeps existing image_url and cover_image fields as fallback

ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Seed Calm Home Office Starter Kit with dedicated composite banner image
UPDATE collections
SET banner_image_url = 'https://wlfwdbusmzgdiryhtdki.supabase.co/storage/v1/object/public/collections/calm-home-office-starter-kit-banner.jpg'
WHERE slug = 'home-office-starter-kit' OR slug = 'the-calm-home-office-starter-kit';
