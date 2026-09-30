'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Sparkles, Flame, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { DealCard } from '../../components/DealCard';

export type DealFilterKey = 'all' | 'free' | 'steals';

interface DealsHubClientProps {
  initialDeals: EnrichedProduct[];
  activeFilter?: DealFilterKey;
}

export function DealsHubClient({ initialDeals, activeFilter = 'all' }: DealsHubClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlFilter = (searchParams.get('filter') as DealFilterKey) || activeFilter;
  const [currentFilter, setCurrentFilter] = useState<DealFilterKey>(
    urlFilter === 'free' || urlFilter === 'steals' ? urlFilter : 'all'
  );

  // Compute counts
  const counts = useMemo(() => {
    let freeCount = 0;
    let stealsCount = 0;

    for (const item of initialDeals) {
      const p = item.product;
      const isFree = Boolean(p.is_free || p.isFree || item.offer?.price === 0 || p.price === 0);
      const discount = p.discount_percent ?? p.discountPercent ?? 0;

      if (isFree) {
        freeCount++;
      }
      if (isFree || discount >= 80) {
        stealsCount++;
      }
    }

    return {
      all: initialDeals.length,
      free: freeCount,
      steals: stealsCount
    };
  }, [initialDeals]);

  // Filter items
  const filteredDeals = useMemo(() => {
    if (currentFilter === 'free') {
      return initialDeals.filter(item => {
        const p = item.product;
        return Boolean(p.is_free || p.isFree || item.offer?.price === 0 || p.price === 0);
      });
    }

    if (currentFilter === 'steals') {
      return initialDeals.filter(item => {
        const p = item.product;
        const isFree = Boolean(p.is_free || p.isFree || item.offer?.price === 0 || p.price === 0);
        const discount = p.discount_percent ?? p.discountPercent ?? 0;
        return isFree || discount >= 80;
      });
    }

    return initialDeals;
  }, [initialDeals, currentFilter]);

  const handleFilterChange = (filter: DealFilterKey) => {
    setCurrentFilter(filter);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (filter === 'all') {
        params.delete('filter');
      } else {
        params.set('filter', filter);
      }
      const newQuery = params.toString();
      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, { scroll: false });
    });
  };

  return (
    <div className="space-y-8">
      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200/80 dark:border-white/10 w-fit">
        <button
          type="button"
          onClick={() => handleFilterChange('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            currentFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>All Verified Deals</span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
              currentFilter === 'all'
                ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900 font-bold'
                : 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-400'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleFilterChange('free')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            currentFilter === 'free'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-emerald-500/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>100% Free &amp; Student Perks</span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
              currentFilter === 'free'
                ? 'bg-slate-950/20 text-slate-950 font-bold'
                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {counts.free}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleFilterChange('steals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            currentFilter === 'steals'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-500/10'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>80%+ Steals</span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
              currentFilter === 'steals'
                ? 'bg-white/20 text-white font-bold'
                : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}
          >
            {counts.steals}
          </span>
        </button>
      </div>

      {/* Grid of Deals */}
      {filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((item, index) => (
            <DealCard
              key={item.product.id || item.product.slug}
              item={item}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center mx-auto text-slate-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            No Active Deals in this Category
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            We only list verified discounts meeting our strict price history vetting. Check back soon or browse all verified deals.
          </p>
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 cursor-pointer"
          >
            <span>View All Verified Deals</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default DealsHubClient;
