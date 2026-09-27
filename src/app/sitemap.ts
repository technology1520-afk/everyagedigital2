import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.everyagedigital.store';
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let [{ data: products }, { data: collections }] = await Promise.all([
    supabase.from('products').select('slug, updated_at').eq('status', 'active'),
    supabase.from('collections').select('slug, updated_at').eq('is_active', true),
  ]);

  if (!collections || collections.length === 0) {
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

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const productRoutes = (products || []).map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const collectionRoutes = (collections || []).map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
