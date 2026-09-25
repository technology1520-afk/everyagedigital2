'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWishlist } from '../../context/WishlistContext';
import { getProductById } from '../../lib/search/catalogSearch';
import { ComparisonTable } from '../../components/ui/ComparisonTable';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AffiliateDisclosure } from '../../components/ui/AffiliateDisclosure';
import { Scale, Share2, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

function CompareContent() {
  const searchParams = useSearchParams();
  const { compareProductIds, clearCompare } = useWishlist();
  const [copied, setCopied] = useState(false);

  // Combine query param ids with context ids
  const queryIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const activeIds = Array.from(new Set([...compareProductIds, ...queryIds])).slice(0, 4);

  const items = activeIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const handleShare = () => {
    if (items.length === 0) return;
    const idsString = items.map(i => i.product.id).join(',');
    const url = `${window.location.origin}/compare?ids=${idsString}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Product Comparison' }]} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-purple-200/50 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-blue-400 font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Comparison Matrix</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">
            Compare Specs, Trade-Offs & Prices
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Examine up to 4 vetted products side-by-side to understand exact situational trade-offs.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="touch-target inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-purple-200/60 dark:border-white/15 text-slate-800 dark:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Comparison'}</span>
            </button>
            <button
              type="button"
              onClick={clearCompare}
              className="touch-target inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-purple-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[44px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      <ComparisonTable items={items} />

      {items.length > 0 && items.length < 4 && (
        <div className="text-center py-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-white/[0.04] border border-dashed border-purple-300 dark:border-blue-400/40 text-purple-700 dark:text-blue-300 rounded-xl text-xs font-semibold hover:bg-purple-100/50 dark:hover:bg-blue-500/10 backdrop-blur-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add another product from shop ({4 - items.length} slot{4 - items.length > 1 ? 's' : ''} left)</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
