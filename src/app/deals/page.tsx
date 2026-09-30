import React from 'react';
import { Metadata } from 'next';
import { getDealsAsync } from '../../lib/search/catalogSearch';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { DealsHubClient, DealFilterKey } from './DealsHubClient';
import { Flame, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Deals Hub: 80%+ Deep Discounts & 100% Free Student/Creator Perks',
  description: 'Verified 80%+ software bargains, 100% free student & creator perks, and hardware markdowns vetted against authentic price histories.'
};

interface DealsPageProps {
  searchParams?: Promise<{ filter?: string }> | { filter?: string };
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const activeFilter = (resolvedParams.filter as DealFilterKey) || 'all';

  // Strict deals query: only items where is_deal = true OR is_free = true OR discount_percent >= 50
  const deals = await getDealsAsync();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Deals & Perks Hub' }]} />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-slate-950/80 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deep Discounts &amp; Student Perks Hub</span>
            <span className="text-emerald-500/40">•</span>
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free .edu Benefits</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            80%+ Deep Discounts &amp; Free Perks
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Curated software licenses, academic perks, and high-utility clearance markdowns. Every perk is vetted for genuine commercial value, zero hidden charges, and authentic pricing integrity.
          </p>
        </div>
      </div>

      {/* Editorial Trust Banner: No Fake Urgency */}
      <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900 dark:text-white font-semibold">Strict Price Integrity Standard:</strong>{' '}
          We never display simulated countdown timers, fabricated stock warnings, or inflated MSRP baselines. All perks are verified directly with student verification portals (Handshake, SheerID) and authorized merchant feeds.
        </div>
      </div>

      {/* Interactive Deals Catalog with Filter Pills */}
      <React.Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white/40 dark:bg-white/5" />}>
        <DealsHubClient initialDeals={deals} activeFilter={activeFilter} />
      </React.Suspense>
    </div>
  );
}
