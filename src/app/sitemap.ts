import { MetadataRoute } from 'next';
import { PRODUCTS, COLLECTIONS, BOOKS, OWNED_PRODUCTS } from '../data/seedCatalog';
import { getAllCategories } from '../lib/search/catalogSearch';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://everyagedigital.com';

  const staticRoutes = [
    '',
    '/shop',
    '/books',
    '/deals',
    '/assistant',
    '/compare',
    '/shop/own-products',
    '/collections',
    '/about',
    '/methodology',
    '/affiliate-disclosure',
    '/privacy',
    '/terms',
    '/contact'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  const productRoutes = PRODUCTS.map(p => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9
  }));

  const collectionRoutes = COLLECTIONS.map(c => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(c.lastReviewedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  const bookRoutes = BOOKS.map(b => ({
    url: `${baseUrl}/books/${b.slug}`,
    lastModified: new Date(b.lastCheckedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  const ownedRoutes = OWNED_PRODUCTS.map(op => ({
    url: `${baseUrl}/shop/own-products/${op.slug}`,
    lastModified: new Date(op.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.85
  }));

  const categoryRoutes = getAllCategories().map(cat => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...collectionRoutes,
    ...bookRoutes,
    ...ownedRoutes,
    ...categoryRoutes
  ];
}
