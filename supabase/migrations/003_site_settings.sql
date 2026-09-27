-- Migration 003: site_settings for dynamic seasonal theme & configuration
-- Supabase / PostgreSQL Migration

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_settings (key, value) 
VALUES ('seasonal_theme', '{"active": false, "theme": "halloween"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
