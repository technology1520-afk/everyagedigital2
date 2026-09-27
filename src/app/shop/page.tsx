import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ShopMarketplace } from '../../components/shop/ShopMarketplace';
import { catalogRepository } from '../../lib/db/repository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // Retrieve live products from Supabase (or repository fallback)
  const initialProducts = await catalogRepository.getAllProducts({ status: 'active' });

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading marketplace...</div>}>
        <ShopMarketplace
          initialProducts={initialProducts}
          initialCategory={initialCategory}
          initialMerchant={initialMerchant}
          initialQuery={initialQuery}
          className="px-0"
        />
      </Suspense>
    </div>
  );
}
