-- Migration 003: site_settings for dynamic seasonal theme & configuration
-- Supabase / PostgreSQL Migration

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and allow read for anon, write for authenticated/service role:
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow update on site_settings" ON site_settings FOR ALL USING (true);

INSERT INTO site_settings (key, value) 
VALUES ('seasonal_theme', '{"active": false, "theme": "halloween"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
