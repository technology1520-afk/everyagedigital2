'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ExternalLink, 
  Check, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface BundleItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  merchantName: string;
  affiliateUrl: string;
  whyCurated: string;
  sourceProductId?: string;
}

interface BundleProductListProps {
  items: BundleItem[];
  collectionTitle: string;
}

export function BundleProductList({ items, collectionTitle }: BundleProductListProps) {
  // All items selected by default
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(items.map(item => item.id))
  );
  const [openingTabs, setOpeningTabs] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  };

  const selectedItems = items.filter(item => selectedIds.has(item.id) && typeof item.price === 'number' && item.price > 0);
  const selectedCount = selectedItems.length;
  const totalCount = items.filter(item => typeof item.price === 'number' && item.price > 0).length;
  const totalPrice = selectedItems.reduce((acc, item) => {
    const val = typeof item.price === 'number' && !isNaN(item.price) && item.price > 0 ? item.price : 0;
    return acc + val;
  }, 0);

  const handleBuyBundle = () => {
    if (selectedItems.length === 0) return;
    setOpeningTabs(true);
    setTimeout(() => setOpeningTabs(false), 2500);

    // Check if all selected items are Amazon items
    const allAmazon = selectedItems.every(item => 
      item.merchantName.toLowerCase().includes('amazon') ||
      item.affiliateUrl.includes('amazon.com')
    );

    if (allAmazon) {
      const asins: string[] = [];
      for (const item of selectedItems) {
        const match = item.affiliateUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
        if (match && match[1]) {
          asins.push(match[1]);
        } else if (item.sourceProductId && /^[A-Z0-9]{10}$/i.test(item.sourceProductId)) {
          asins.push(item.sourceProductId);
        }
      }

      // If all Amazon products have identifiable ASINs, build unified cart
      if (asins.length === selectedItems.length && asins.length > 0) {
        const params = new URLSearchParams();
        params.set('AssociateTag', 'everyagedigital-20');
        asins.forEach((asin, idx) => {
          params.set(`ASIN.${idx + 1}`, asin);
          params.set(`Quantity.${idx + 1}`, '1');
        });
        const cartUrl = `https://www.amazon.com/gp/aws/cart/add.html?${params.toString()}`;
        window.open(cartUrl, '_blank', 'noopener,noreferrer');
        return;
      }
    }

    // Direct multi-tab launch for individual/mixed merchants
    selectedItems.forEach(item => {
      if (item.affiliateUrl) {
        window.open(item.affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    });
  };

  return (
    <section className="space-y-6 pb-28">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200/40 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Items Included in this Bundle
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Toggle items below to customize your bundle package and live total price.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleSelectAll}
          className="self-start sm:self-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          {selectedIds.size === items.length ? 'Deselect All' : 'Select All Items'}
        </button>
      </div>

      {/* Product List Cards */}
      <div className="space-y-4">
        {items.map(item => {
          const isSelected = selectedIds.has(item.id);
          const isAmazon = item.merchantName.toLowerCase().includes('amazon') || item.affiliateUrl.includes('amazon.com');

          return (
            <div
              key={item.id}
              className={`rounded-2xl transition-all duration-200 backdrop-blur-xl border p-5 sm:p-6 ${
                isSelected
                  ? 'bg-white/80 dark:bg-slate-900/60 border-purple-200/60 dark:border-white/15 shadow-md'
                  : 'bg-white/40 dark:bg-slate-900/30 border-slate-200/40 dark:border-white/5 opacity-70 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                {/* Left: Checkbox + Thumbnail + Details */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Custom Checkbox */}
                  <label
                    htmlFor={`item-check-${item.id}`}
                    className="flex items-center cursor-pointer select-none pt-1 shrink-0"
                    title={isSelected ? 'Remove from bundle' : 'Add to bundle'}
                  >
                    <input
                      id={`item-check-${item.id}`}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(item.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'bg-white/80 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </label>

                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-white/10 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content details */}
                  <div className="min-w-0 space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100/90 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        /{item.slug}
                      </span>
                    </div>

                    <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      <Link
                        href={`/product/${item.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </h3>

                    {item.whyCurated && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200">Why it&apos;s curated: </span>
                        {item.whyCurated}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Pricing + Direct Merchant Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 dark:border-white/10">
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                      ${item.price.toFixed(2)}
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-xs text-slate-400 line-through font-mono">
                        ${item.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 transition-colors shadow-xs"
                  >
                    <span>{isAmazon ? 'Get on Amazon' : 'Direct Merchant'}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bundle Checkout Bar (Fixed Glass Dock at bottom of viewport) */}
      <div className="fixed bottom-6 inset-x-4 max-w-4xl mx-auto rounded-2xl bg-slate-950/80 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/15 p-4 shadow-2xl flex items-center justify-between z-40 text-white">
        {/* Left Side: Dynamic Count & Total */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">
              {selectedCount} of {totalCount} items selected
            </span>
            {selectedCount === totalCount && totalCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                Complete Set
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Bundle Total:</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Side: Primary CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBuyBundle}
            disabled={selectedCount === 0}
            className="touch-target bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 sm:px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm whitespace-nowrap">
              {openingTabs ? 'Opening Merchant Links...' : selectedCount === totalCount ? 'Buy Complete Bundle' : `Buy Selected (${selectedCount})`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline-block" />
          </button>
        </div>
      </div>
    </section>
  );
}
