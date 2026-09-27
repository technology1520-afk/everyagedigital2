'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { MerchantBadge } from './MerchantBadge';
import { SponsoredBadge } from './SponsoredBadge';
import { WishlistButton } from './WishlistButton';
import { CompareButton } from './CompareButton';

export interface ProductCardProps {
  item: EnrichedProduct;
  showCompare?: boolean;
  className?: string;
  priority?: boolean;
  index?: number;
}

export function ProductCard({
  item,
  showCompare = true,
  className = '',
  priority,
  index
}: ProductCardProps) {
  const { product, offer, freshness } = item;
  const isAmazon = offer?.merchantName === 'Amazon';
  const isPriority = priority !== undefined ? priority : (index !== undefined ? index < 2 : false);

  const getBadgeInfo = () => {
    if (product.editorialBadge) {
      const lower = product.editorialBadge.toLowerCase();
      if (lower.includes('value')) {
        return { label: product.editorialBadge, className: 'badge-best-value' };
      }
      if (lower.includes('new')) {
        return { label: product.editorialBadge, className: 'badge-new' };
      }
      return { label: product.editorialBadge, className: 'badge-top-pick' };
    }
    if (product.productType === 'digital') {
      return { label: 'Digital Resource', className: 'badge-digital' };
    }
    return null;
  };

  const badgeInfo = getBadgeInfo();
  const isDigital = product.productType === 'digital';

  const productAny = product as Record<string, any>;
  const getDisplayPrice = (): number | null => {
    const candidates = [
      offer?.price,
      product.price,
      product.price_min,
      product.priceMin,
      product.current_price,
      productAny.price,
      productAny.price_min,
      productAny.current_price
    ];
    for (const c of candidates) {
      if (c !== undefined && c !== null) {
        const num = typeof c === 'number' ? c : parseFloat(String(c));
        if (!isNaN(num) && num > 0) return num;
      }
    }
    return null;
  };

  const displayPrice = getDisplayPrice();

  const isHalloweenItem = Boolean(
    product.slug?.toLowerCase().includes('halloween') ||
    product.name?.toLowerCase().includes('halloween') ||
    product.category?.toLowerCase().includes('halloween') ||
    (Array.isArray(productAny.tags) && productAny.tags.some((t: string) => String(t).toLowerCase().includes('halloween') || String(t).toLowerCase().includes('spooky')))
  );

  return (
    <article
      className={`group relative rounded-2xl bg-white/80 dark:bg-white/[0.04] [html[data-seasonal=halloween]_&]:bg-slate-950/80 [html[data-seasonal=halloween]_&]:border-orange-500/20 [html[data-seasonal=halloween]_&]:hover:border-orange-500/60 [html[data-seasonal=halloween]_&]:shadow-lg [html[data-seasonal=halloween]_&]:shadow-black/40 backdrop-blur-lg border border-purple-100 dark:border-white/10 hover:border-purple-300 dark:hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300 shadow-sm dark:shadow-none overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Top Media & Actions */}
      <div
        className={`relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center p-3 ${
          isDigital ? 'thumb-digital' : ''
        }`}
      >
        <Link href={`/product/${product.slug}`} className="relative w-full h-full block flex items-center justify-center">
          <Image
            src={product.imageUrl}
            alt={product.altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            priority={isPriority}
            className="h-full w-full object-contain drop-shadow-md rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start pointer-events-none z-10">
          {isHalloweenItem && (
            <span className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[10px] px-2 py-0.5 rounded-full font-semibold backdrop-blur-md shadow-xs">
              <span className="text-xs">🎃</span>
              <span>Spooky Pick</span>
            </span>
          )}
          {badgeInfo && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/10 [html[data-seasonal=halloween]_&]:bg-slate-900/80 [html[data-seasonal=halloween]_&]:text-orange-200 [html[data-seasonal=halloween]_&]:border-orange-500/30 backdrop-blur-md border border-purple-200/50 dark:border-white/10 text-slate-800 dark:text-white shadow-xs"
            >
              <Award className="w-3 h-3 shrink-0 text-amber-400" />
              <span className="truncate max-w-[90px] sm:max-w-none">{badgeInfo.label}</span>
            </span>
          )}
          {product.isSponsored && <SponsoredBadge />}
        </div>

        {/* Floating Quick Action Buttons (Row on phone, column on tablet+) */}
        <div className="absolute top-2 right-2 flex flex-row sm:flex-col gap-1.5 z-10">
          <WishlistButton
            productId={product.id}
            className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all"
          />
          {showCompare && (
            <CompareButton
              productId={product.id}
              className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-mono uppercase tracking-wider text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {product.brand}
            </span>
            {offer && <MerchantBadge merchant={offer.merchantName} />}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-xs sm:text-base text-slate-900 dark:text-white [html[data-seasonal=halloween]_&]:text-amber-50 leading-snug line-clamp-2 mb-2">
            <Link href={`/product/${product.slug}`} className="group-hover:text-purple-600 dark:group-hover:text-blue-300 [html[data-seasonal=halloween]_&]:group-hover:text-orange-300 focus:outline-hidden transition-colors">
              {product.name}
            </Link>
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-xs leading-relaxed text-slate-300 [html[data-seasonal=halloween]_&]:text-orange-200/70 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Best for highlight */}
          {(product.bestFor || productAny.best_for) && (
            <div className="w-full min-h-[42px] rounded-lg bg-white/[0.04] dark:bg-white/[0.03] border border-white/5 [html[data-seasonal=halloween]_&]:bg-orange-950/40 [html[data-seasonal=halloween]_&]:border-orange-500/20 px-2.5 py-1.5 my-2 flex items-center">
              <p className="text-[11px] leading-snug text-slate-300 dark:text-slate-300 [html[data-seasonal=halloween]_&]:text-orange-200 font-medium line-clamp-2">
                <span className="font-semibold text-white [html[data-seasonal=halloween]_&]:text-orange-100">Best for:</span> {product.bestFor || productAny.best_for}
              </p>
            </div>
          )}
        </div>

        {/* Price + CTA Row (Stacked full-width on phone, side-by-side on sm+) */}
        <div className="mt-3.5 sm:mt-4">
          <div className="card-price-row border-t border-purple-100 dark:border-white/10 [html[data-seasonal=halloween]_&]:border-orange-500/20 pt-3">
            <div>
              {freshness?.isStale ? (
                <span className="price-stale block text-xs text-amber-600 dark:text-amber-400 [html[data-seasonal=halloween]_&]:text-amber-300 [html[data-seasonal=halloween]_&]:font-bold [html[data-seasonal=halloween]_&]:text-lg italic">Check current price &uarr;</span>
              ) : displayPrice !== null ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="card-price-val text-lg font-bold text-slate-900 dark:text-white [html[data-seasonal=halloween]_&]:text-amber-300 [html[data-seasonal=halloween]_&]:font-bold [html[data-seasonal=halloween]_&]:text-lg">${displayPrice.toFixed(2)}</span>
                  {offer?.originalPrice && offer.originalPrice > displayPrice && (
                    <span className="line-through text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 [html[data-seasonal=halloween]_&]:text-orange-200/50">
                      ${offer.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-medium text-slate-400 [html[data-seasonal=halloween]_&]:text-amber-300 [html[data-seasonal=halloween]_&]:font-bold [html[data-seasonal=halloween]_&]:text-lg">Check Price</span>
              )}
            </div>

            <div className="w-full sm:w-auto">
              {offer ? (
                <a
                  href={`/api/go/${product.id}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="btn-view-deal w-full sm:w-auto text-xs font-semibold cursor-pointer text-center justify-center py-2 sm:py-2.5 px-3 sm:px-4 bg-purple-600 hover:bg-purple-500 dark:bg-blue-600 dark:hover:bg-blue-500 [html[data-seasonal=halloween]_&]:bg-gradient-to-r [html[data-seasonal=halloween]_&]:from-orange-600 [html[data-seasonal=halloween]_&]:to-amber-600 [html[data-seasonal=halloween]_&]:hover:from-orange-500 [html[data-seasonal=halloween]_&]:hover:to-amber-500 [html[data-seasonal=halloween]_&]:text-white [html[data-seasonal=halloween]_&]:font-semibold [html[data-seasonal=halloween]_&]:rounded-xl [html[data-seasonal=halloween]_&]:shadow-md [html[data-seasonal=halloween]_&]:shadow-orange-950/50 text-white rounded-xl shadow-lg shadow-purple-600/20 dark:shadow-blue-500/25 transition-all"
                >
                  <span>View Deal &rarr;</span>
                </a>
              ) : (
                <Link
                  href={`/product/${product.slug}`}
                  className="btn-view-deal w-full sm:w-auto text-xs font-semibold cursor-pointer text-center justify-center py-2 sm:py-2.5 px-3 sm:px-4 bg-purple-600 hover:bg-purple-500 dark:bg-blue-600 dark:hover:bg-blue-500 [html[data-seasonal=halloween]_&]:bg-gradient-to-r [html[data-seasonal=halloween]_&]:from-orange-600 [html[data-seasonal=halloween]_&]:to-amber-600 [html[data-seasonal=halloween]_&]:hover:from-orange-500 [html[data-seasonal=halloween]_&]:hover:to-amber-500 [html[data-seasonal=halloween]_&]:text-white [html[data-seasonal=halloween]_&]:font-semibold [html[data-seasonal=halloween]_&]:rounded-xl [html[data-seasonal=halloween]_&]:shadow-md [html[data-seasonal=halloween]_&]:shadow-orange-950/50 text-white rounded-xl shadow-lg shadow-purple-600/20 dark:shadow-blue-500/25 transition-all"
                >
                  <span>View Deal &rarr;</span>
                </Link>
              )}
            </div>
          </div>

          {/* Affiliate disclosure micro-text under the button */}
          <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 [html[data-seasonal=halloween]_&]:text-orange-300/60 text-right mt-1 sm:mt-1.5 leading-tight">
            {isAmazon
              ? 'Paid Amazon link'
              : 'Direct merchant link'}
          </p>
        </div>
      </div>
    </article>
  );
}
