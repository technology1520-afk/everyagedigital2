import { MetadataRoute } from 'next';
import { getAllCollectionsAsync } from '../lib/search/catalogSearch';
import { catalogRepository } from '../lib/db/repository';
import { getCollectionBannerImage } from '../lib/db/supabaseMapper';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.everyagedigital.store';

  const [products, collections] = await Promise.all([
    catalogRepository.getAllProducts({ status: 'active' }),
    getAllCollectionsAsync({ storefrontOnly: true })
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const productRoutes = products.map((p) => {
    const rawImg = p.imageUrl || (p as any).image_url;
    return {
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      images: rawImg ? [rawImg] : undefined
    };
  });

  const collectionRoutes = collections.map((c) => {
    const banner = getCollectionBannerImage(c);
    return {
      url: `${baseUrl}/collections/${c.slug}`,
      lastModified: c.lastReviewedAt ? new Date(c.lastReviewedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: banner ? [banner] : undefined
    };
  });

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
