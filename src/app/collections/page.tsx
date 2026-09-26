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
  title: 'Curated Collections & Gear Bundles — EveryAge Digital',
  description: 'Hand-picked, thematic setups and verified starter kits. Built for distraction-free deep work, ergonomics, and daily productivity.',
  openGraph: {
    title: 'Curated Collections & Gear Bundles — EveryAge Digital',
    description: 'Thematic gear kits and tool bundles with transparent selection criteria.'
  }
};

export default async function CollectionsIndexPage() {
  // Query storefront-only collections: is_active/published = true AND activeProductCount > 0
  const collections = await getAllCollectionsAsync({ storefrontOnly: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Collections' }
        ]}
      />

      {/* Page Header */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xl shadow-purple-900/5 rounded-3xl p-6 sm:p-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold border border-purple-200/80 dark:border-purple-800/40">
            <Boxes className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Curated Sets &amp; Bundles</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Curated Collections &amp; Gear Kits
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Tested, cohesive toolkits assembled for specific workflows. Every bundle requires at least 3 months of daily hands-on editorial vetting before earning inclusion.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map(col => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg border border-purple-100 dark:border-white/10 p-12 text-center my-8 space-y-4 shadow-sm dark:shadow-none">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Boxes className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">Bundles Currently Updating</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Our editorial team is refreshing our curated kits with verified merchant stocks. Check back shortly or browse all catalog products.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
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
