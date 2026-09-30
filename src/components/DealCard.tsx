'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Sparkles, ArrowUpRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { EnrichedProduct } from '../lib/search/catalogSearch';
import { WishlistButton } from './ui/WishlistButton';
import { MerchantBadge } from './ui/MerchantBadge';

export interface DealCardProps {
  item: EnrichedProduct;
  priority?: boolean;
  className?: string;
}

export function DealCard({ item, priority = false, className = '' }: DealCardProps) {
  const { product, offer } = item;

  const rawImg = product.imageUrl || product.image_url;
  const displayImage = (rawImg && typeof rawImg === 'string' && rawImg.trim() !== '')
    ? rawImg
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  const isFree = Boolean(
    product.is_free ||
    product.isFree ||
    product.price === 0 ||
    offer?.price === 0
  );

  const originalPrice = product.original_price ?? product.originalPrice ?? offer?.originalPrice;
  const currentPrice = isFree ? 0 : (product.price ?? offer?.price ?? 0);

  let discountPercent = product.discount_percent ?? product.discountPercent;
  if (discountPercent === undefined || discountPercent === null) {
    if (isFree) {
      discountPercent = 100;
    } else if (originalPrice && originalPrice > currentPrice) {
      discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    } else {
      discountPercent = 0;
    }
  }

  const isEightyPlus = !isFree && discountPercent >= 80;

  const claimUrl = product.affiliate_url || product.affiliateUrl || offer?.affiliateUrl || product.officialUrl || '#';
  const merchantName = product.merchant || offer?.merchantName || 'Direct Brand';
  const dealFacts = (product.deal_facts || product.dealFacts) as Record<string, string> | undefined;

  return (
    <article
      className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-md hover:shadow-xl ${
        isFree
          ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_4px_20px_rgba(16,185,129,0.08)]'
          : isEightyPlus
            ? 'border-rose-500/30 hover:border-rose-500/60 shadow-[0_4px_20px_rgba(244,63,94,0.08)]'
            : 'border-slate-200 dark:border-white/10 hover:border-amber-500/30 shadow-xs'
      } ${className}`}
    >
      {/* Top Banner Accent Line */}
      <div
        className={`h-1.5 w-full ${
          isFree
            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'
            : isEightyPlus
              ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500'
              : 'bg-gradient-to-r from-amber-500 to-indigo-500'
        }`}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Media Container */}
        <div className="relative aspect-video sm:aspect-16/10 w-full rounded-xl overflow-hidden bg-slate-950/40 border border-slate-200/40 dark:border-white/10 mb-4">
          <Link href={`/deals/${product.slug}`} className="relative block w-full h-full">
            <Image
              src={displayImage}
              alt={product.altText || product.name || 'Deal Specimen'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Subtle Gradient Shade */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          </Link>

          {/* Floating Badges (Top Left) */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-10 pointer-events-none">
            {isFree && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                <Sparkles className="w-3 h-3 text-slate-950 fill-current" />
                100% FREE PERK
              </span>
            )}

            {isEightyPlus && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]">
                <Flame className="w-3 h-3 text-amber-300 fill-current" />
                {discountPercent}% OFF
              </span>
            )}

            {!isFree && !isEightyPlus && discountPercent >= 50 && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-slate-950">
                <Flame className="w-3 h-3 text-slate-950" />
                {discountPercent}% OFF
              </span>
            )}

            {product.verified_date && (
              <span className="inline-flex items-center gap-1 font-mono text-[9px] font-medium tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                {product.verified_date}
              </span>
            )}
          </div>

          {/* Action buttons (Top Right) */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            <WishlistButton productId={product.id} variant="overlay" />
          </div>

          {/* Bottom Bar inside image: Value Banner */}
          {dealFacts?.value && (
            <div className="absolute bottom-2 left-2.5 right-2.5 z-10 pointer-events-none">
              <span className="font-mono text-[10px] font-medium text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20 backdrop-blur-md inline-block">
                Value: {dealFacts.value}
              </span>
            </div>
          )}
        </div>

        {/* Merchant & Category */}
        <div className="flex items-center justify-between gap-2 text-xs mb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold truncate">
            {merchantName}
          </span>
          <MerchantBadge merchant={merchantName} />
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          <Link href={`/deals/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Description Snippet */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Deal Facts Quick Badges */}
        {dealFacts && (
          <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 mb-4 text-[11px]">
            {dealFacts.duration && (
              <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate">
                <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{dealFacts.duration}</span>
              </div>
            )}
            {dealFacts.access && (
              <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{dealFacts.access}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pricing & CTA Footer */}
      <div className="p-4 sm:p-5 pt-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Verified Price
            </span>
            <div className="flex items-baseline gap-2">
              {isFree ? (
                <>
                  <span className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    FREE
                  </span>
                  {originalPrice && originalPrice > 0 && (
                    <span className="font-mono text-xs line-through text-slate-400 dark:text-slate-500">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-mono text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    ${currentPrice.toFixed(2)}
                  </span>
                  {originalPrice && originalPrice > currentPrice && (
                    <span className="font-mono text-xs line-through text-slate-400 dark:text-slate-500">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Details Link */}
          <Link
            href={`/deals/${product.slug}`}
            className="text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 transition-colors"
          >
            How to claim →
          </Link>
        </div>

        {/* Primary Outbound Action Button */}
        <a
          href={claimUrl}
          target="_blank"
          rel="sponsored nofollow noopener"
          className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] ${
            isFree
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:shadow-emerald-500/30'
              : isEightyPlus
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20 hover:shadow-rose-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950'
          }`}
        >
          <span>{isFree ? 'Claim Free Perk' : 'Get This Deal'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

export default DealCard;
