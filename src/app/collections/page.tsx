import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Boxes, Sparkles, ArrowRight } from 'lucide-react';
import { getAllCollectionsAsync } from '../../lib/search/catalogSearch';
import { CollectionCard } from '../../components/ui/CollectionCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Curated Collections & Gear Bundles',
  description: 'Hand-picked, thematic setups and verified starter kits. Built for distraction-free deep work, ergonomics, and daily productivity.',
  alternates: {
    canonical: 'https://www.everyagedigital.store/collections',
  },
  openGraph: {
    title: 'Curated Collections & Gear Bundles — EveryAge Digital',
    description: 'Thematic gear kits and tool bundles with transparent selection criteria.',
    url: 'https://www.everyagedigital.store/collections',
  }
};

export default async function CollectionsIndexPage() {
  // Query storefront-only collections: is_active/published = true AND activeProductCount > 0
  const collections = await getAllCollectionsAsync({ storefrontOnly: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Collections' }
        ]}
      />

      {/* Page Header */}
      <div className="bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 text-xs font-mono uppercase tracking-wider border border-neutral-300 dark:border-neutral-700">
            <Boxes className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Curated Sets &amp; Bundles</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-normal tracking-tight text-neutral-900 dark:text-white leading-tight">
            Curated Collections &amp; Gear Kits
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            Tested, cohesive toolkits assembled for specific workflows. Every bundle requires at least 3 months of daily hands-on editorial vetting before earning inclusion.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {collections.map(col => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 p-12 text-center my-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center mx-auto">
            <Boxes className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-neutral-900 dark:text-white font-normal text-lg">Bundles Currently Updating</h2>
          <p className="text-xs sm:text-sm font-mono text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Our editorial team is refreshing our curated kits with verified merchant stocks. Check back shortly or browse all catalog products.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
