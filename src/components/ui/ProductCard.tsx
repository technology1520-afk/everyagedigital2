'use client';

import React from 'react';
import Link from 'next/link';
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
}

export function ProductCard({ item, showCompare = true, className = '' }: ProductCardProps) {
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
      className={`product-card group relative bg-white overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Top Media & Actions */}
      <div
        className={`relative aspect-4/3 w-full bg-[#F0F1ED] overflow-hidden ${
          isDigital ? 'thumb-digital' : ''
        }`}
      >
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.altText}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start pointer-events-none">
          {badgeInfo && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${badgeInfo.className}`}
            >
              <Award className="w-3 h-3 shrink-0" />
              <span>{badgeInfo.label}</span>
            </span>
          )}
          {product.isSponsored && <SponsoredBadge />}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <WishlistButton productId={product.id} />
          {showCompare && <CompareButton productId={product.id} />}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 mb-1.5">
            <span className="font-mono uppercase tracking-wider text-[11px] font-medium text-neutral-400">
              {product.brand}
            </span>
            {offer && <MerchantBadge merchant={offer.merchantName} />}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base text-neutral-900 leading-snug line-clamp-2">
            <Link href={`/product/${product.slug}`} className="product-title focus:outline-hidden transition-colors">
              {product.name}
            </Link>
          </h3>

          {/* Short Factual Description */}
          <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Best for highlight */}
          {product.bestFor && (
            <div className="mt-2.5 py-1.5 px-2 bg-[#F7F7F4] rounded text-[11px] text-neutral-700 border border-neutral-200/60 line-clamp-1">
              <strong className="text-neutral-900 font-medium">Best for:</strong> {product.bestFor}
            </div>
          )}
        </div>

        {/* Price + CTA Row (6b) */}
        <div className="mt-4">
          <div className="card-price-row">
            <div>
              {freshness?.isStale ? (
                <span className="price-stale">Check current price &uarr;</span>
              ) : offer ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="product-price">${offer.price.toFixed(2)}</span>
                  {offer.originalPrice && offer.originalPrice > offer.price && (
                    <span className="price-note line-through">
                      ${offer.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="product-price">—</span>
              )}
            </div>

            <div>
              {offer ? (
                <a
                  href={`/api/go/${product.id}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="btn-view-deal text-xs font-semibold cursor-pointer"
                >
                  <span>View Deal &rarr;</span>
                </a>
              ) : (
                <Link
                  href={`/product/${product.slug}`}
                  className="btn-view-deal text-xs font-semibold cursor-pointer"
                >
                  <span>View Deal &rarr;</span>
                </Link>
              )}
            </div>
          </div>

          {/* Affiliate disclosure micro-text under the button */}
          <p className="text-[10px] text-neutral-400 text-right mt-1.5 leading-none">
            {isAmazon
              ? 'Paid Amazon link (qualifying purchase)'
              : 'Direct external merchant affiliate link'}
          </p>
        </div>
      </div>
    </article>
  );
}
