-- Migration 003: site_settings for dynamic seasonal theme & configuration
-- Supabase / PostgreSQL Migration

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Service write site_settings" ON site_settings FOR ALL USING (true);

INSERT INTO site_settings (key, value)
VALUES ('seasonal_theme', '{"active": false, "theme": "halloween"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
