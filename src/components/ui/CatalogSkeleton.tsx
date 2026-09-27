import React from 'react';

interface CatalogSkeletonProps {
  cardCount?: number;
  showHeader?: boolean;
}

export function CatalogSkeleton({
  cardCount = 8,
  showHeader = true,
}: CatalogSkeletonProps) {
  return (
    <div
      aria-label="Loading catalog content"
      aria-busy="true"
      className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Pulsing Skeleton Header */}
      {showHeader && (
        <div className="space-y-4">
          {/* Breadcrumb / Tag Placeholder */}
          <div className="h-4 w-28 bg-slate-200/70 dark:bg-white/10 rounded-full animate-pulse" />

          {/* Main Headline */}
          <div className="h-9 sm:h-11 w-64 sm:w-96 bg-slate-200/80 dark:bg-white/10 rounded-2xl animate-pulse" />

          {/* Editorial Subtitle Line */}
          <div className="h-4 w-full max-w-lg bg-slate-200/50 dark:bg-white/5 rounded-md animate-pulse" />

          {/* Filter Pills Placeholder */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <div className="h-9 w-28 bg-slate-200/60 dark:bg-white/5 rounded-xl border border-purple-100/60 dark:border-white/10 animate-pulse" />
            <div className="h-9 w-24 bg-slate-200/60 dark:bg-white/5 rounded-xl border border-purple-100/60 dark:border-white/10 animate-pulse" />
            <div className="h-9 w-32 bg-slate-200/60 dark:bg-white/5 rounded-xl border border-purple-100/60 dark:border-white/10 animate-pulse" />
            <div className="h-9 w-24 bg-slate-200/60 dark:bg-white/5 rounded-xl border border-purple-100/60 dark:border-white/10 animate-pulse ml-auto hidden sm:block" />
          </div>
        </div>
      )}

      {/* Matching 4-Column Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <article
            key={idx}
            className="group relative rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-lg border border-purple-100 dark:border-white/10 p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-none animate-pulse transition-all duration-300"
          >
            {/* Aspect-square image placeholder matching real product cards */}
            <div className="relative w-full aspect-square rounded-xl bg-slate-200/60 dark:bg-white/5 border border-purple-100/40 dark:border-white/5 overflow-hidden flex items-center justify-center p-3 mb-3.5 sm:mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-300/40 dark:bg-white/10" />

              {/* Floating Badge Placeholder */}
              <div className="absolute top-2 left-2 h-5 w-20 rounded-full bg-slate-300/40 dark:bg-white/10" />

              {/* Floating Action Button Placeholder */}
              <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-slate-300/40 dark:bg-white/10" />
            </div>

            {/* Card Content Placeholder */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Brand & Merchant Line */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="h-3 w-16 bg-slate-200/70 dark:bg-white/10 rounded" />
                  <div className="h-4 w-14 bg-slate-200/60 dark:bg-white/10 rounded-full" />
                </div>

                {/* Two Skeleton Lines for Title */}
                <div className="space-y-1.5 mb-2.5">
                  <div className="h-4 w-5/6 bg-slate-300/70 dark:bg-white/10 rounded" />
                  <div className="h-4 w-3/5 bg-slate-300/50 dark:bg-white/10 rounded" />
                </div>

                {/* Skeleton Line for Description */}
                <div className="space-y-1 mb-3">
                  <div className="h-3 w-full bg-slate-200/50 dark:bg-white/5 rounded" />
                  <div className="h-3 w-4/5 bg-slate-200/40 dark:bg-white/5 rounded" />
                </div>

                {/* Editorial "Best for" Box */}
                <div className="h-9 w-full bg-slate-100/70 dark:bg-white/[0.03] rounded-lg border border-purple-50 dark:border-white/5 mb-3 hidden sm:block" />
              </div>

              {/* Footer: Price + Button Pill */}
              <div className="pt-3 border-t border-purple-100 dark:border-white/10 flex items-center justify-between gap-3 mt-auto">
                <div className="h-5 w-16 bg-slate-300/70 dark:bg-white/10 rounded" />
                <div className="h-8 w-24 bg-purple-500/20 dark:bg-blue-600/30 rounded-full" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CatalogSkeleton;
