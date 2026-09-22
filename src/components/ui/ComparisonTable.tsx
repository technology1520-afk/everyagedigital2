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
      <div className="py-20 text-center bg-white border border-neutral-200 rounded-2xl p-8">
        <h3 className="text-base font-semibold text-neutral-900">No products in comparison</h3>
        <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
          Browse the catalog and click the &ldquo;Compare&rdquo; scale button on up to 4 products to compare specs, merchants, and trade-offs side by side.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-[#1D438A] text-white text-xs font-semibold rounded-xl hover:bg-[#153266] transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.length > 3 && (
        <div className="md:hidden flex items-center gap-2 p-3 bg-[#F2EBDD]/60 border border-[#E0D3BC] rounded-xl text-xs text-[#4A3B22]">
          <Info className="w-4 h-4 text-[#A15C00] shrink-0" />
          <span>Showing 3 of {items.length} products on phone. Remove one to add another, or view on tablet/desktop.</span>
        </div>
      )}

      <div className={`overflow-x-auto bg-white border border-[#E2E5EB] rounded-2xl shadow-xs scrollbar-thin ${className}`}>
        <table className="w-full text-left border-collapse min-w-[580px] sm:min-w-[700px]">
          <thead>
            <tr className="border-b border-neutral-200 bg-[#F7F7F4]">
              {/* Sticky Attribute Column Header */}
              <th className="sticky left-0 bg-[#F7F7F4] z-20 p-3 sm:p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-32 sm:w-44 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
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
                      className="touch-target absolute -top-1 -right-1 w-11 h-11 flex items-center justify-center text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 cursor-pointer"
                      title="Remove from comparison"
                      aria-label={`Remove ${product.name} from comparison`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="aspect-4/3 w-full bg-neutral-100 rounded-lg overflow-hidden mb-3 relative">
                      <Image
                        src={product.imageUrl}
                        alt={product.altText}
                        fill
                        sizes="(max-width: 639px) 180px, 240px"
                        className="object-cover"
                      />
                    </div>

                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">
                      {product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 mt-0.5">
                      <Link href={`/product/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </h4>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs">
            {/* Price & Merchant */}
            <tr>
              <td className="sticky left-0 bg-white z-20 p-3 sm:p-4 font-semibold text-neutral-700 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
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
              <td className="sticky left-0 bg-white z-20 p-3 sm:p-4 font-semibold text-neutral-700 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                Best Suited For
              </td>
              {items.map(({ product }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 text-neutral-700 leading-relaxed ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  {product.bestFor}
                </td>
              ))}
            </tr>

            {/* Trade-offs & Limitations */}
            <tr>
              <td className="sticky left-0 bg-white z-20 p-3 sm:p-4 font-semibold text-neutral-700 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                Key Trade-offs
              </td>
              {items.map(({ product }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 text-neutral-600 leading-relaxed bg-amber-50/30 ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {product.limitations.length > 0 ? product.limitations[0] : product.notFor}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Key Features */}
            <tr>
              <td className="sticky left-0 bg-white z-20 p-3 sm:p-4 font-semibold text-neutral-700 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                Top Features
              </td>
              {items.map(({ product }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  <ul className="space-y-1 text-[11px] text-neutral-600">
                    {product.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Outbound CTA */}
            <tr className="bg-neutral-50/50">
              <td className="sticky left-0 bg-neutral-50 z-20 p-3 sm:p-4 font-semibold text-neutral-700 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                Direct Link
              </td>
              {items.map(({ product, offer }, idx) => (
                <td key={product.id} className={`p-3 sm:p-4 ${idx >= 3 ? 'hidden md:table-cell' : ''}`}>
                  {offer ? (
                    <a
                      href={offer.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="touch-target inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors min-h-[44px]"
                    >
                      <span>View at {offer.merchantName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-neutral-400 italic">No active offer</span>
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

