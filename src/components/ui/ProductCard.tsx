'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Award } from 'lucide-react';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { MerchantBadge } from './MerchantBadge';
import { PriceStatus } from './PriceStatus';
import { FreshnessLabel } from './FreshnessLabel';
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

  const getCtaLabel = () => {
    if (!offer) return 'View Details';
    if (freshness?.isStale) return 'Check Current Price';
    if (offer.merchantName === 'Amazon') return 'View at Amazon';
    if (offer.merchantName === 'Gumroad') return 'View on Gumroad';
    if (offer.merchantName === 'Direct Brand') return 'Visit Direct Brand';
    return `See Offer on ${offer.merchantName}`;
  };

  const isAmazon = offer?.merchantName === 'Amazon';

  return (
    <article
      className={`group relative bg-white border border-[#E2E5EB] rounded-xl overflow-hidden hover:border-[#1D438A]/40 transition-all duration-200 hover:shadow-md flex flex-col justify-between ${className}`}
    >
      {/* Top Media & Actions */}
      <div className="relative aspect-4/3 w-full bg-[#F0F1ED] overflow-hidden">
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
          {product.editorialBadge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#F2EBDD] text-[#4A3B22] border border-[#E0D3BC] shadow-xs">
              <Award className="w-3 h-3 text-[#A15C00]" />
              {product.editorialBadge}
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
          <h3 className="font-semibold text-base text-neutral-900 leading-snug group-hover:text-[#1D438A] transition-colors line-clamp-2">
            <Link href={`/product/${product.slug}`} className="focus:outline-hidden">
              {product.name}
            </Link>
          </h3>

          {/* Short Factual Description */}
          <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Best for highlight */}
          <div className="mt-3 py-1.5 px-2 bg-[#F7F7F4] rounded text-[11px] text-neutral-700 border border-neutral-200/60 line-clamp-1">
            <strong className="text-neutral-900 font-medium">Best for:</strong> {product.bestFor}
          </div>
        </div>

        {/* Pricing, Freshness, & Outbound CTA */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col gap-3">
          <div className="flex items-end justify-between gap-2">
            <PriceStatus offer={offer} freshness={freshness} size="md" />
            <FreshnessLabel freshness={freshness} />
          </div>

          <div className="flex items-center gap-2">
            {offer ? (
              <a
                href={offer.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors shadow-xs"
              >
                <span>{getCtaLabel()}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            ) : (
              <Link
                href={`/product/${product.slug}`}
                className="flex-1 inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                View Details
              </Link>
            )}

            <Link
              href={`/product/${product.slug}`}
              className="py-2 px-3 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 border border-neutral-200 transition-colors text-center"
            >
              Review
            </Link>
          </div>

          {/* Micro affiliate notice */}
          <p className="text-[10px] text-neutral-400 text-center leading-none">
            {isAmazon
              ? 'Paid Amazon link (qualifying purchase)'
              : 'Direct external merchant affiliate link'}
          </p>
        </div>
      </div>
    </article>
  );
}
