import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.everyagedigital.store';

  // Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  let products: Array<{ slug: string; updated_at?: string | null }> | null = null;
  let collections: Array<{ slug: string; updated_at?: string | null }> | null = null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Query Supabase for dynamic products
      const { data: prodData } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('status', 'active');
      products = prodData;

      // Query Supabase for dynamic collections
      const { data: colData, error: colError } = await supabase
        .from('collections')
        .select('slug, updated_at')
        .eq('is_active', true);

      if (!colError && colData && colData.length > 0) {
        collections = colData;
      } else {
        // Fallback to active schema columns if is_active/updated_at is not standard on collections
        const { data: altCols } = await supabase
          .from('collections')
          .select('slug, last_reviewed_at, created_at, status')
          .neq('status', 'draft');

        if (altCols) {
          collections = altCols
            .filter((c) => !c.slug.startsWith('__'))
            .map((c) => ({
              slug: c.slug,
              updated_at: c.last_reviewed_at || c.created_at,
            }));
        }
      }
    } catch (err) {
      console.warn('[sitemap] Supabase dynamic fetch error:', err);
    }
  }

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = (collections || []).map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(c.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
