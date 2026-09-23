import React from 'react';
import { Metadata } from 'next';
import { getDealsAsync } from '../../lib/search/catalogSearch';
import { ProductGrid } from '../../components/ui/ProductGrid';
import { AffiliateDisclosure } from '../../components/ui/AffiliateDisclosure';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Flame, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Verified Deals & Best Value Recommendations',
  description: 'Hand-vetted deals, discounts, and high-utility everyday items with verified pricing history.'
};

export default async function DealsPage() {
  const deals = await getDealsAsync();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Deals & Best Value' }]} />

      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 text-xs font-semibold border border-amber-500/20">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Price-Sensitive Curations</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Verified Deals & Practical Value
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          We monitor price fluctuations across partner merchant catalogs. Below are items currently exhibiting verified merchant markdowns or recognized with our &ldquo;Best Value&rdquo; badge.
        </p>
      </div>

      <div className="bg-white border border-[#E2E5EB] rounded-xl p-4 text-xs text-neutral-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-neutral-900">No Fake Urgency:</strong> We never display artificial countdown timers, fake &ldquo;only 2 left!&rdquo; warnings, or inflated reference MSRPs. Prices reflect the latest verified merchant feeds.
        </div>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      <ProductGrid items={deals} columns={3} emptyMessage="No active deals currently meet our vetting standards." />
    </div>
  );
}
