import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ShopMarketplace } from '../../components/shop/ShopMarketplace';

export const metadata: Metadata = {
  title: 'Shop All Curated Products & Digital Resources',
  description: 'Browse vetted everyday essentials, home office gear, books, and digital systems with clear editorial information and price checks.'
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialCategory = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const initialMerchant = typeof resolvedParams.merchant === 'string' ? resolvedParams.merchant : undefined;
  const initialQuery = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading marketplace...</div>}>
      <ShopMarketplace
        initialCategory={initialCategory}
        initialMerchant={initialMerchant}
        initialQuery={initialQuery}
      />
    </Suspense>
  );
}
