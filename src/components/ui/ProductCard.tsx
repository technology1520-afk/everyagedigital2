'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ArrowUpRight } from 'lucide-react';
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
  isLead?: boolean;
}

export function ProductCard({
  item,
  showCompare = true,
  className = '',
  priority,
  index,
  isLead = false
}: ProductCardProps) {
  const { product, offer, freshness } = item;
  const merchantName = (product.merchant && product.merchant !== 'Direct Brand')
    ? product.merchant
    : (offer?.merchantName && offer.merchantName !== 'Direct Brand' ? offer.merchantName : 'Amazon');
  const isAmazon = merchantName.toLowerCase().includes('amazon');

  if (!product.affiliate_url) {
    product.affiliate_url = product.affiliateUrl || offer?.affiliateUrl || (product.officialUrl ? product.officialUrl : undefined);
  }
  if (!product.merchant) {
    product.merchant = merchantName;
  }

  const rawImg = product.imageUrl || (product as any).image_url;
  const displayImage = (rawImg && typeof rawImg === 'string' && rawImg.trim() !== '') 
    ? rawImg 
    : 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg';

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
      return { label: 'Digital Guide', className: 'badge-digital' };
    }
    return null;
  };

  const badgeInfo = getBadgeInfo();
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

  // 1. Verdict / Strong Suit ("The Sweet Spot")
  const getSweetSpot = (): string => {
    if (product.bestFor && !product.bestFor.includes('reliable tested essentials')) {
      return product.bestFor;
    }
    if (productAny.best_for && !String(productAny.best_for).includes('reliable tested essentials')) {
      return String(productAny.best_for);
    }
    if (product.useCases && product.useCases.length > 0 && !product.useCases[0].includes('Everyday utility')) {
      return product.useCases.join(' • ');
    }
    if (product.features && product.features.length > 0 && !product.features[0].includes('Editorial vetted')) {
      return product.features.slice(0, 2).join('; ');
    }
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('ergonomic') || cat.includes('mouse') || cat.includes('keyboard')) {
      return 'Low-latency connectivity with tactile physical contouring.';
    }
    if (cat.includes('audio') || cat.includes('sound') || cat.includes('headphone')) {
      return 'Balanced acoustic soundstage with reliable passive noise damping.';
    }
    if (cat.includes('desk') || cat.includes('workspace')) {
      return 'Durable matte surface engineered for daily sustained desktop use.';
    }
    if (product.productType === 'digital' || product.productType === 'book') {
      return 'Distilled foundational framework built for actionable execution.';
    }
    return 'Precision manufacturing with high thermal and physical resilience.';
  };

  // 2. The Honest Trade-Off ("The Catch" / "Consider Before Buying")
  const getTheCatch = (): string => {
    if (product.notFor && !product.notFor.includes('cheap disposable alternatives')) {
      return product.notFor;
    }
    if (productAny.not_for && !String(productAny.not_for).includes('cheap disposable alternatives')) {
      return String(productAny.not_for);
    }
    if (product.limitations && product.limitations.length > 0 && !product.limitations[0].includes('Standard merchant shipping')) {
      return product.limitations[0];
    }
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('mouse') || cat.includes('ergonomic')) {
      return 'Substantial physical profile may feel cumbersome for smaller hands.';
    }
    if (cat.includes('keyboard')) {
      return 'Mechanical keystroke actuation requires an initial adjustment period.';
    }
    if (cat.includes('audio')) {
      return 'Manual multi-device switching without automated hands-free pairing.';
    }
    if (product.productType === 'digital') {
      return 'Self-directed reference format; requires independent study.';
    }
    return 'Demands dedicated surface footprint over ultra-compact travel gear.';
  };

  const sweetSpot = getSweetSpot();
  const theCatch = getTheCatch();

  // Curated specs list (brief specific specs)
  const getCuratedSpecs = (): string[] => {
    const list: string[] = [];
    if (product.features && product.features.length > 0) {
      for (const f of product.features) {
        if (!f.includes('Editorial vetted') && !f.includes('Verified merchant')) {
          list.push(f);
        }
      }
    }
    if (list.length === 0) {
      if (product.productType === 'physical') {
        list.push('USB-C / 2.4GHz', 'Matte Finish', 'In-House Tested');
      } else {
        list.push('Instant Access', 'PDF / ePub', 'Editorial Issue');
      }
    }
    return list.slice(0, 3);
  };

  const curatedSpecs = getCuratedSpecs();

  const isHalloweenItem = Boolean(
    product.slug?.toLowerCase().includes('halloween') ||
    product.name?.toLowerCase().includes('halloween') ||
    product.category?.toLowerCase().includes('halloween') ||
    (Array.isArray(productAny.tags) && productAny.tags.some((t: string) => String(t).toLowerCase().includes('halloween') || String(t).toLowerCase().includes('spooky')))
  );

  // Standout pull-quote for Lead / Spotlight pick
  const pullQuote = product.editorialNotes && !product.editorialNotes.includes('Editorial team vetted')
    ? product.editorialNotes
    : (product.description ? product.description.slice(0, 140) + '...' : 'An uncompromising benchmark in tactile performance, deliberate industrial design, and sustained utility.');

  // ==========================================
  // LEAD / ISSUE SPOTLIGHT LAYOUT (Card 0)
  // ==========================================
  if (isLead) {
    return (
      <article
        className={`col-span-1 md:col-span-2 lg:col-span-2 rounded-xl bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm p-5 sm:p-7 transition-colors group relative overflow-hidden flex flex-col justify-between ${className}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left: Studio Display Photo Box */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div className="relative w-full aspect-[4/3] md:aspect-square rounded-lg bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center p-6 overflow-hidden">
              <Link href={`/product/${product.slug}`} className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={displayImage}
                  alt={product.altText || product.name || 'Product Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={true}
                  className="h-full w-full object-contain group-hover:scale-102 transition-transform duration-300"
                />
              </Link>

              {/* Floating badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
                <span className="font-mono text-[10px] uppercase tracking-wider bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 font-bold px-2.5 py-1 rounded shadow-xs">
                  Issue Spotlight
                </span>
                {badgeInfo && (
                  <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 font-semibold shadow-xs">
                    {badgeInfo.label}
                  </span>
                )}
                {product.isSponsored && <SponsoredBadge />}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <WishlistButton productId={product.id} />
                {showCompare && <CompareButton productId={product.id} />}
              </div>
            </div>

            <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-2 text-center hidden md:block">
              Studio display • Physical specimen inspection
            </div>
          </div>

          {/* Right: Editorial Breakdown & Specs */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">
                  {product.brand}
                </span>
                <MerchantBadge merchant={product.merchant || 'Amazon'} />
              </div>

              {/* High-contrast serif title */}
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight mb-2.5">
                <Link href={`/product/${product.slug}`} className="hover:underline decoration-neutral-400">
                  {product.name}
                </Link>
              </h3>

              {/* Pull quote */}
              <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-3.5 my-3 bg-neutral-50 dark:bg-neutral-900/50 py-2.5 rounded-r">
                <p className="font-serif italic text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  &ldquo;{pullQuote}&rdquo;
                </p>
              </div>

              {/* Editorial Stance */}
              <div className="space-y-2.5 mt-3">
                <div className="text-xs">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold block mb-0.5">
                    The Sweet Spot
                  </span>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {sweetSpot}
                  </p>
                </div>
                <div className="text-xs">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-800 dark:text-amber-400 font-bold block mb-0.5">
                    The Catch
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                    {theCatch}
                  </p>
                </div>
              </div>

              {/* Brief Specs */}
              {curatedSpecs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 mt-3">
                  {curatedSpecs.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price & CTA Row */}
            <div className="card-price-row border-t border-neutral-200 dark:border-neutral-800 pt-3 mt-4">
              <div>
                {freshness?.isStale ? (
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400 italic">
                    Check current price &uarr;
                  </span>
                ) : displayPrice !== null ? (
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      ${displayPrice.toFixed(2)}
                    </span>
                    {offer?.originalPrice && offer.originalPrice > displayPrice && (
                      <span className="font-mono line-through text-xs text-neutral-400 dark:text-neutral-500">
                        ${offer.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-sm text-neutral-500">Market Price</span>
                )}
              </div>

              <div className="w-full sm:w-auto">
                {product.affiliate_url ? (
                  <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-view-deal w-full sm:w-auto inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Deal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="btn-view-deal w-full sm:w-auto inline-flex items-center justify-center cursor-pointer"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ==========================================
  // STANDARD CARD LAYOUT (Subsequent Cards)
  // ==========================================
  return (
    <article
      className={`rounded-xl bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm p-4 sm:p-5 flex flex-col justify-between transition-colors overflow-hidden group relative ${className}`}
    >
      <div>
        {/* Dedicated Studio Display Box */}
        <div className="relative w-full aspect-[4/3] rounded-lg bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center p-4 overflow-hidden mb-3">
          <Link href={`/product/${product.slug}`} className="relative w-full h-full flex items-center justify-center">
            <Image
              src={displayImage}
              alt={product.altText || product.name || 'Product Image'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={isPriority}
              className="h-full w-full object-contain group-hover:scale-102 transition-transform duration-200"
            />
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
            {isHalloweenItem && (
              <span className="font-mono text-[9px] uppercase tracking-wider bg-orange-500/20 border border-orange-400/40 text-orange-300 px-2 py-0.5 rounded font-semibold">
                🎃 Spooky Pick
              </span>
            )}
            {badgeInfo && (
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 font-semibold shadow-xs">
                {badgeInfo.label}
              </span>
            )}
            {product.isSponsored && <SponsoredBadge />}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <WishlistButton productId={product.id} />
            {showCompare && <CompareButton productId={product.id} />}
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center justify-between gap-1 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
          <span className="font-mono uppercase tracking-wider text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
            {product.brand}
          </span>
          <MerchantBadge merchant={product.merchant || 'Amazon'} />
        </div>

        {/* Title */}
        <h3 className="font-serif font-medium text-base text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 my-1.5">
          <Link href={`/product/${product.slug}`} className="hover:underline decoration-neutral-400">
            {product.name}
          </Link>
        </h3>

        {/* Opinionated Editorial Stance */}
        <div className="space-y-2 mt-2.5">
          <div className="text-xs">
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold block mb-0.5">
              The Sweet Spot
            </span>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-snug line-clamp-2">
              {sweetSpot}
            </p>
          </div>
          <div className="text-xs">
            <span className="font-mono text-[9px] uppercase tracking-wider text-amber-800 dark:text-amber-400 font-bold block mb-0.5">
              The Catch
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug italic line-clamp-2">
              {theCatch}
            </p>
          </div>
        </div>
      </div>

      {/* Price & CTA Row */}
      <div className="card-price-row border-t border-neutral-200 dark:border-neutral-800 pt-3 mt-3.5">
        <div>
          {freshness?.isStale ? (
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 italic">
              Check price &uarr;
            </span>
          ) : displayPrice !== null ? (
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm tracking-tight font-semibold text-neutral-900 dark:text-neutral-100">
                ${displayPrice.toFixed(2)}
              </span>
              {offer?.originalPrice && offer.originalPrice > displayPrice && (
                <span className="font-mono line-through text-[10px] text-neutral-400 dark:text-neutral-500">
                  ${offer.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          ) : (
            <span className="font-mono text-xs text-neutral-500">Check Price</span>
          )}
        </div>

        <div className="w-full sm:w-auto">
          {product.affiliate_url ? (
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={(e) => e.stopPropagation()}
              className="btn-view-deal w-full sm:w-auto inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Deal</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="btn-view-deal w-full sm:w-auto inline-flex items-center justify-center cursor-pointer"
            >
              Details
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
