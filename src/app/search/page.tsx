import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ShopMarketplace } from '../../components/shop/ShopMarketplace';
import { catalogRepository } from '../../lib/db/repository';

import { CatalogSkeleton } from '../../components/ui/CatalogSkeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Search Catalog & Curated Recommendations',
  description: 'Search our verified database of physical products, everyday tools, books, and digital resources.'
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialQuery = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;

  const initialProducts = await catalogRepository.getAllProducts({ status: 'active' });
  const initialOffers = catalogRepository.getOffers();

  return (
    <Suspense fallback={<CatalogSkeleton cardCount={8} showHeader={false} />}>
      <ShopMarketplace initialProducts={initialProducts} initialOffers={initialOffers} initialQuery={initialQuery} />
    </Suspense>
  );
}
