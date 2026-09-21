import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ShopMarketplace } from '../../components/shop/ShopMarketplace';

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

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading search...</div>}>
      <ShopMarketplace initialQuery={initialQuery} />
    </Suspense>
  );
}
