import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://everyagedigital.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/shop/own-products/checkout-demo']
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
