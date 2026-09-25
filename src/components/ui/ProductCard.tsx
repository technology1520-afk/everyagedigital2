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

interface ProductCardProps {
  item: EnrichedProduct;
  showCompare?: boolean;
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  item,
  showCompare = true,
  className = '',
  priority = false
}: ProductCardProps) {
  const { product, offer, freshness } = item;
  const isAmazon = offer?.merchantName === 'Amazon';

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

  return (
    <article
      className={`group relative rounded-2xl bg-white/[0.04] backdrop-blur-lg border border-white/10 hover:border-blue-400/40 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Top Media & Actions (Square on phone, 4:3 on tablet/desktop) */}
      <div
        className={`relative aspect-square sm:aspect-4/3 w-full bg-slate-900/60 overflow-hidden ${
          isDigital ? 'thumb-digital' : ''
        }`}
      >
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={product.imageUrl}
            alt={product.altText}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            priority={priority}
            className="object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start pointer-events-none z-10">
          {badgeInfo && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-xs"
            >
              <Award className="w-3 h-3 shrink-0 text-amber-400" />
              <span className="truncate max-w-[90px] sm:max-w-none">{badgeInfo.label}</span>
            </span>
          )}
          {product.isSponsored && <SponsoredBadge />}
        </div>

        {/* Floating Quick Action Buttons (Row on phone, column on tablet+) */}
        <div className="absolute top-2 right-2 flex flex-row sm:flex-col gap-1.5 z-10">
          <WishlistButton productId={product.id} />
          {showCompare && <CompareButton productId={product.id} />}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between gap-1 text-xs text-slate-400 mb-1.5">
            <span className="font-mono uppercase tracking-wider text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">
              {product.brand}
            </span>
            {offer && <MerchantBadge merchant={offer.merchantName} />}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-xs sm:text-base text-white leading-snug line-clamp-2">
            <Link href={`/product/${product.slug}`} className="group-hover:text-blue-300 focus:outline-hidden transition-colors">
              {product.name}
            </Link>
          </h3>

          {/* Description (visible on sm+) */}
          <p className="hidden sm:block mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Best for highlight (visible on sm+) */}
          {product.bestFor && (
            <div className="hidden sm:block mt-2.5 py-1.5 px-2 bg-white/5 rounded-xl text-[11px] text-slate-300 border border-white/10 backdrop-blur-sm line-clamp-1">
              <strong className="text-white font-medium">Best for:</strong> {product.bestFor}
            </div>
          )}
        </div>

        {/* Price + CTA Row (Stacked full-width on phone, side-by-side on sm+) */}
        <div className="mt-3.5 sm:mt-4">
          <div className="card-price-row border-t border-white/10 pt-3">
            <div>
              {freshness?.isStale ? (
                <span className="price-stale block text-xs text-amber-400 italic">Check current price &uarr;</span>
              ) : offer ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-bold text-white">${offer.price.toFixed(2)}</span>
                  {offer.originalPrice && offer.originalPrice > offer.price && (
                    <span className="line-through text-[10px] sm:text-xs text-slate-500">
                      ${offer.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm sm:text-base text-slate-400">—</span>
              )}
            </div>

            <div className="w-full sm:w-auto">
              {offer ? (
                <a
                  href={`/api/go/${product.id}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="btn-view-deal w-full sm:w-auto text-xs font-semibold cursor-pointer text-center justify-center py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>View Deal &rarr;</span>
                </a>
              ) : (
                <Link
                  href={`/product/${product.slug}`}
                  className="btn-view-deal w-full sm:w-auto text-xs font-semibold cursor-pointer text-center justify-center py-2 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>View Deal &rarr;</span>
                </Link>
              )}
            </div>
          </div>

          {/* Affiliate disclosure micro-text under the button */}
          <p className="text-[9px] sm:text-[10px] text-slate-400 text-right mt-1 sm:mt-1.5 leading-tight">
            {isAmazon
              ? 'Paid Amazon link'
              : 'Direct merchant link'}
          </p>
        </div>
      </div>
    </article>
  );
}
