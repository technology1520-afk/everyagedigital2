import React from 'react';
import { Metadata } from 'next';
import { getProductById } from '../../../lib/search/catalogSearch';
import { ComparisonTable } from '../../../components/ui/ComparisonTable';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { AffiliateDisclosure } from '../../../components/ui/AffiliateDisclosure';
import { Scale } from 'lucide-react';

interface CompareSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'desk-essentials' },
    { slug: 'ergonomic-controllers' }
  ];
}

export async function generateMetadata({ params }: CompareSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Product Comparison: ${slug.replace(/-/g, ' ')}`,
    description: `Side-by-side spec and value comparison curated by EveryAge Digital.`
  };
}

export default async function CompareSlugPage({ params }: CompareSlugPageProps) {
  const { slug } = await params;

  // Curated presets for popular comparisons
  let productIds = ['prod-1', 'prod-2'];
  if (slug === 'desk-essentials') {
    productIds = ['prod-1', 'prod-2', 'prod-7'];
  } else if (slug === 'ergonomic-controllers') {
    productIds = ['prod-2', 'prod-7'];
  }

  const items = productIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Compare', href: '/compare' },
          { label: slug.replace(/-/g, ' ') }
        ]}
      />

      <div className="max-w-3xl space-y-3 pb-6 border-b border-[#E2E5EB]">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Curated Head-to-Head Comparison</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Editorial head-to-head analysis comparing performance, ergonomics, and real-world value.
        </p>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      <ComparisonTable items={items} />
    </div>
  );
}
