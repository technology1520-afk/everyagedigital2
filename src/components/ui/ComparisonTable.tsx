'use client';

import React from 'react';
import Link from 'next/link';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { MerchantBadge } from './MerchantBadge';
import { PriceStatus } from './PriceStatus';
import { FreshnessLabel } from './FreshnessLabel';
import { ExternalLink, X, Check, AlertCircle } from 'lucide-react';
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
          className="mt-5 inline-flex items-center px-4 py-2 bg-[#1D438A] text-white text-xs font-semibold rounded-lg hover:bg-[#153266] transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto bg-white border border-[#E2E5EB] rounded-2xl shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-neutral-200 bg-[#F7F7F4]">
            <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-44">
              Attribute
            </th>
            {items.map(({ product }) => (
              <th key={product.id} className="p-4 w-64 align-top">
                <div className="flex flex-col justify-between h-full relative">
                  <button
                    type="button"
                    onClick={() => toggleCompareProduct(product.id)}
                    className="absolute -top-1 -right-1 p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200 cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="aspect-4/3 w-full bg-neutral-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.altText}
                      className="w-full h-full object-cover"
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
            <td className="p-4 font-semibold text-neutral-700 bg-[#F7F7F4]/50">Merchant & Price</td>
            {items.map(({ product, offer, freshness }) => (
              <td key={product.id} className="p-4">
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
            <td className="p-4 font-semibold text-neutral-700 bg-[#F7F7F4]/50">Best Suited For</td>
            {items.map(({ product }) => (
              <td key={product.id} className="p-4 text-neutral-700 leading-relaxed">
                {product.bestFor}
              </td>
            ))}
          </tr>

          {/* Trade-offs & Limitations */}
          <tr>
            <td className="p-4 font-semibold text-neutral-700 bg-[#F7F7F4]/50">Key Trade-offs</td>
            {items.map(({ product }) => (
              <td key={product.id} className="p-4 text-neutral-600 leading-relaxed bg-amber-50/30">
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
            <td className="p-4 font-semibold text-neutral-700 bg-[#F7F7F4]/50">Top Features</td>
            {items.map(({ product }) => (
              <td key={product.id} className="p-4">
                <ul className="space-y-1 text-[11px] text-neutral-600">
                  {product.features.slice(0, 3).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-1">
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
            <td className="p-4 font-semibold text-neutral-700">Direct Link</td>
            {items.map(({ product, offer }) => (
              <td key={product.id} className="p-4">
                {offer ? (
                  <a
                    href={offer.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors"
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
  );
}
