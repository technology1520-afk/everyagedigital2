'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { MerchantOffer } from '../../types';
import { FreshnessResult } from '../../lib/affiliate/adapters';

interface StickyProductCTAProps {
  productId: string;
  productSlug: string;
  offer?: MerchantOffer;
  freshness?: FreshnessResult;
}

export function StickyProductCTA({
  productId,
  productSlug,
  offer,
  freshness
}: StickyProductCTAProps) {
  const isAmazon = offer?.merchantName === 'Amazon';

  const getCtaText = () => {
    if (!offer) return 'Check Details';
    if (freshness?.isStale) return 'Check Current Price';
    if (offer.merchantName === 'Amazon') return 'View on Amazon';
    if (offer.merchantName === 'Gumroad') return 'View on Gumroad';
    return `View on ${offer.merchantName}`;
  };

  return (
    <div
      className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 p-3 px-4 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] transition-all"
      aria-label="Sticky Purchase Bar"
    >
      {/* Affiliate micro-text above button */}
      <p className="text-[10px] text-slate-400 text-center mb-1.5 leading-none">
        {isAmazon
          ? 'As an Amazon Associate I earn from qualifying purchases'
          : 'Direct partner referral link'}
      </p>

      <div className="flex items-center justify-between gap-3">
        <div>
          {freshness?.isStale ? (
            <span className="text-xs italic text-amber-300 font-semibold">Live price check</span>
          ) : offer ? (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">${offer.price.toFixed(2)}</span>
              {offer.originalPrice && offer.originalPrice > offer.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${offer.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400">Direct Resource</span>
          )}
        </div>

        <div>
          {offer ? (
            <a
              href={`/api/go/${productId}`}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="touch-target inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all min-h-[44px]"
            >
              <span>{getCtaText()}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          ) : (
            <Link
              href={`/product/${productSlug}`}
              className="touch-target inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold min-h-[44px]"
            >
              Learn More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
