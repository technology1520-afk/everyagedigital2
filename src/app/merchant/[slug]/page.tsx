import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllMerchants } from '../../../lib/search/catalogSearch';
import { ShopMarketplace } from '../../../components/shop/ShopMarketplace';

interface MerchantPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const merchants = getAllMerchants();
  return merchants.map(m => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: MerchantPageProps): Promise<Metadata> {
  const { slug } = await params;
  const merchants = getAllMerchants();
  const merchant = merchants.find(m => m.slug === slug);
  if (!merchant) return { title: 'Merchant Not Found' };

  return {
    title: `Products via ${merchant.name}`,
    description: `Browse editorial product recommendations fulfilled through ${merchant.name}.`
  };
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const { slug } = await params;
  const merchants = getAllMerchants();
  const merchant = merchants.find(m => m.slug === slug);

  if (!merchant) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading merchant offers...</div>}>
      <ShopMarketplace initialMerchant={merchant.name} />
    </Suspense>
  );
}
