import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllMerchants, getAllMerchantsAsync } from '../../../lib/search/catalogSearch';
import { catalogRepository } from '../../../lib/db/repository';
import { ShopMarketplace } from '../../../components/shop/ShopMarketplace';
import { CatalogSkeleton } from '../../../components/ui/CatalogSkeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface MerchantPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MerchantPageProps): Promise<Metadata> {
  const { slug } = await params;
  const merchants = (await getAllMerchantsAsync()) || getAllMerchants();
  const merchant = merchants.find(m => m.slug === slug);
  if (!merchant) return { title: 'Merchant Not Found' };

  return {
    title: `Products via ${merchant.name}`,
    description: `Browse editorial product recommendations fulfilled through ${merchant.name}.`
  };
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const { slug } = await params;
  const merchants = (await getAllMerchantsAsync()) || getAllMerchants();
  const merchant = merchants.find(m => m.slug === slug);

  if (!merchant) {
    notFound();
  }

  const initialProducts = await catalogRepository.getAllProducts({ status: 'active' });
  const initialOffers = catalogRepository.getOffers();

  return (
    <Suspense fallback={<CatalogSkeleton cardCount={8} showHeader={false} />}>
      <ShopMarketplace initialProducts={initialProducts} initialOffers={initialOffers} initialMerchant={merchant.name} />
    </Suspense>
  );
}
