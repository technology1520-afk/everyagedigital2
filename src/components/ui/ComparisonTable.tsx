'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { MerchantBadge } from './MerchantBadge';
import { PriceStatus } from './PriceStatus';
import { FreshnessLabel } from './FreshnessLabel';
import { ExternalLink, X, Check, AlertCircle, Info } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

interface ComparisonTableProps {
  items: EnrichedProduct[];
  className?: string;
}

export function ComparisonTable({ items, className = '' }: ComparisonTableProps) {
  const { toggleCompareProduct } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center rounded-3xl bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border border-dashed border-purple-200 dark:border-white/10 p-8 sm:p-12 space-y-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No products in comparison</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          Browse the catalog and click the &ldquo;Compare&rdquo; scale button on up to 4 products to compare specs, merchants, and trade-offs side by side.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-purple-600 hover:bg-purple-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 dark:shadow-blue-500/25 transition-all"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.length > 3 && (
        <div className="md:hidden flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-800 dark:text-amber-200 backdrop-blur-md">
          <Info className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
          <span>Showing 3 of {items.length} products on phone. Remove one to add another, or view on tablet/desktop.</span>
        </div>
      )}

      <div className={`overflow-x-auto rounded-3xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-purple-200/60 dark:border-white/10 shadow-sm dark:shadow-xl scrollbar-thin ${className}`}>
        <table className="w-full text-left border-collapse min-w-[580px] sm:min-w-[700px]">
          <thead>
            <tr className="border-b border-purple-200/50 dark:border-white/10 bg-purple-50/50 dark:bg-slate-950/60">
              {/* Sticky Attribute Column Header */}
              <th className="sticky left-0 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md z-20 p-3 sm:p-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-32 sm:w-44 border-r border-purple-200/50 dark:border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                Attribute
              </th>
              {items.map(({ product }, idx) => (
                <th
                  key={product.id}
                  className={`p-3 sm:p-4 w-52 sm:w-64 align-top ${idx >= 3 ? 'hidden md:table-cell' : ''}`}
                >
                  <div className="flex flex-col justify-between h-full relative">
                    <button
                      type="button"
                      onClick={() => toggleCompareProduct(product.id)}
                      className="touch-target absolute -top-1 -right-1 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-purple-100/50 dark:hover:bg-white/10 cursor-pointer transition-colors"
                      title="Remove from comparison"
                      aria-label={`Remove ${product.name} from comparison`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="aspect-4/3 w-full bg-slate-100 dark:bg-slate-950/40 rounded-xl overflow-hidden mb-3 relative border border-purple-100 dark:border-white/10">
                      <Image
                        src={product.imageUrl}
                        alt={product.altText}
                        fill
                        sizes="(max-width: 639px) 180px, 240px"
                        className="object-cover"
                      />
                    </div>

                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">
                      {product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                      <Link href={`/product/${product.slug}`} className="hover:text-purple-600 dark:hover:text-blue-300 transition-colors">
                        {product.name}
                      </Link>
                    </h4>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-200/40 dark:divide-white/10 text-xs">
            {/* Price & Merchant */}
            <tr>
              <td className="sticky left-0 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md z-20 p-3 sm:p-4 font-semibold text-slate-800 dark:text-slate-200 border-r border-purple-200/50 dark:border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                Merchant & Price
              </td>
              {items.map(({ product, offer, freshness }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  <div className="space-y-1.5">
                    {offer && <MerchantBadge merchant={offer.merchantName} />}
                    <PriceStatus offer={offer} freshness={freshness} size="md" />
                    <FreshnessLabel freshness={freshness} />
                  </div>
                </td>
              ))}
            </tr>

            {/* Best For */}
            <tr>
              <td className="sticky left-0 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md z-20 p-3 sm:p-4 font-semibold text-slate-800 dark:text-slate-200 border-r border-purple-200/50 dark:border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                Best Suited For
              </td>
              {items.map(({ product }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 text-slate-700 dark:text-slate-200 leading-relaxed ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  {product.bestFor}
                </td>
              ))}
            </tr>

            {/* Trade-offs & Limitations */}
            <tr>
              <td className="sticky left-0 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md z-20 p-3 sm:p-4 font-semibold text-slate-800 dark:text-slate-200 border-r border-purple-200/50 dark:border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                Key Trade-offs
              </td>
              {items.map(({ product }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-500/5 ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      {product.limitations.length > 0 ? product.limitations[0] : product.notFor}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Key Features */}
            <tr>
              <td className="sticky left-0 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md z-20 p-3 sm:p-4 font-semibold text-slate-800 dark:text-slate-200 border-r border-purple-200/50 dark:border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                Top Features
              </td>
              {items.map(({ product }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    {product.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Outbound CTA */}
            <tr className="bg-white/40 dark:bg-white/[0.02]">
              <td className="sticky left-0 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md z-20 p-3 sm:p-4 font-semibold text-slate-800 dark:text-slate-200 border-r border-purple-200/50 dark:border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                Direct Link
              </td>
              {items.map(({ product, offer }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  {offer ? (
                    <a
                      href={offer.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="touch-target inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-lg shadow-purple-600/20 dark:shadow-blue-500/25 transition-all min-h-[44px]"
                    >
                      <span>View at {offer.merchantName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 italic">No active offer</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

