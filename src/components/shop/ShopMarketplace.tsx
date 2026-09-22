'use client';

import React, { useState, useMemo } from 'react';
import { FilterParams } from '../../types';
import { searchCatalog } from '../../lib/search/catalogSearch';
import { ProductGrid } from '../ui/ProductGrid';
import { FilterPanel } from '../ui/FilterPanel';
import { FilterBottomSheet } from '../ui/FilterBottomSheet';
import { SortMenu } from '../ui/SortMenu';
import { AffiliateDisclosure } from '../ui/AffiliateDisclosure';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Search, Filter, X, Check } from 'lucide-react';

interface ShopMarketplaceProps {
  initialCategory?: string;
  initialMerchant?: string;
  initialQuery?: string;
}

export function ShopMarketplace({
  initialCategory,
  initialMerchant,
  initialQuery
}: ShopMarketplaceProps) {
  const [filters, setFilters] = useState<FilterParams>({
    category: initialCategory,
    merchant: initialMerchant,
    query: initialQuery,
    sortBy: 'editorial_picks'
  });

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const searchResult = useMemo(() => {
    return searchCatalog(filters);
  }, [filters]);

  // Active filter count for badge
  const activeFilters = useMemo(() => {
    const list: { label: string; onRemove: () => void }[] = [];
    if (filters.category) {
      list.push({
        label: `Category: ${filters.category}`,
        onRemove: () => setFilters(prev => ({ ...prev, category: undefined }))
      });
    }
    if (filters.merchant) {
      list.push({
        label: `Merchant: ${filters.merchant}`,
        onRemove: () => setFilters(prev => ({ ...prev, merchant: undefined }))
      });
    }
    if (filters.productType) {
      const typeLabels: Record<string, string> = {
        physical: 'Physical',
        digital: 'Digital',
        pdf_guide: 'PDF Guide'
      };
      list.push({
        label: `Type: ${typeLabels[filters.productType] || filters.productType}`,
        onRemove: () => setFilters(prev => ({ ...prev, productType: undefined }))
      });
    }
    if (filters.editorialPickOnly) {
      list.push({
        label: 'Editorial Picks',
        onRemove: () => setFilters(prev => ({ ...prev, editorialPickOnly: undefined }))
      });
    }
    if (filters.maxPrice) {
      list.push({
        label: `Under $${filters.maxPrice}`,
        onRemove: () => setFilters(prev => ({ ...prev, maxPrice: undefined }))
      });
    }
    if (filters.query) {
      list.push({
        label: `"${filters.query}"`,
        onRemove: () => setFilters(prev => ({ ...prev, query: undefined }))
      });
    }
    return list;
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({
      sortBy: filters.sortBy
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Shop Marketplace' }]} />

      {/* Title Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E4E7EC]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#234F9E] font-semibold">
            Catalog Marketplace
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 mt-1">
            Curated Commerce Storefront
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Discover vetted everyday essentials, ergonomic tools, books, and digital systems.
          </p>
        </div>

        {/* Search input in header */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={e => setFilters({ ...filters, query: e.target.value })}
            placeholder="Search items, brands, use cases..."
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E4E7EC] rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#234F9E] min-h-[44px]"
          />
        </div>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      {/* Tablet Horizontal Scrollable Chips Bar (md:flex lg:hidden) */}
      <div className="hidden md:flex lg:hidden flex-col gap-2 pt-1 pb-2 border-b border-[#E4E7EC]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-semibold uppercase text-neutral-400 shrink-0 mr-1">
            Categories:
          </span>
          <button
            type="button"
            onClick={() => setFilters({ ...filters, category: undefined })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              !filters.category
                ? 'bg-[#234F9E] text-white'
                : 'bg-[#F0F1ED] text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Categories
          </button>
          {searchResult.availableCategories.map(cat => {
            const isSelected = filters.category?.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setFilters({
                    ...filters,
                    category: isSelected ? undefined : cat
                  })
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                  isSelected
                    ? 'bg-[#234F9E] text-white font-semibold'
                    : 'bg-[#F0F1ED] text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{cat}</span>
                {searchResult.categoryCounts?.[cat] && (
                  <span className="ml-1 opacity-70">
                    ({searchResult.categoryCounts[cat]})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar Filters + Products Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Left Sidebar (hidden on mobile and tablet) */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            availableCategories={searchResult.availableCategories}
            availableMerchants={searchResult.availableMerchants}
            categoryCounts={searchResult.categoryCounts}
            typeCounts={searchResult.typeCounts}
            merchantCounts={searchResult.merchantCounts}
          />
        </div>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Controls Bar: Mobile Filter Button + Item count + Sorting */}
          <div className="results-bar border border-[#E4E7EC] flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-xl">
            <div className="flex items-center gap-3">
              {/* Phone Filter Trigger Button */}
              <button
                type="button"
                onClick={() => setBottomSheetOpen(true)}
                className="touch-target md:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E4E7EC] text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-xs cursor-pointer"
              >
                <Filter className="w-4 h-4 text-[#234F9E]" />
                <span>Filters</span>
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#234F9E] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              <span className="text-xs font-semibold text-neutral-700">
                Showing <span className="text-neutral-900 font-bold">{searchResult.total}</span> item{searchResult.total === 1 ? '' : 's'}
              </span>
            </div>

            <SortMenu
              currentSort={filters.sortBy || 'editorial_picks'}
              onChange={sort => setFilters({ ...filters, sortBy: sort })}
            />
          </div>

          {/* Removable Active Filter Chips Row */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mr-1">
                Active:
              </span>
              {activeFilters.map(chip => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onRemove}
                  className="touch-target inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8EEF9] text-[#234F9E] border border-[#234F9E]/20 hover:bg-[#234F9E]/15 transition-colors cursor-pointer"
                >
                  <span>{chip.label}</span>
                  <X className="w-3.5 h-3.5 opacity-70" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline ml-1 cursor-pointer py-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid
            items={searchResult.items}
            columns={3}
            emptyMessage="No products match your filter criteria."
          />
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
        availableCategories={searchResult.availableCategories}
        availableMerchants={searchResult.availableMerchants}
        categoryCounts={searchResult.categoryCounts}
        typeCounts={searchResult.typeCounts}
        merchantCounts={searchResult.merchantCounts}
        totalResults={searchResult.total}
      />
    </div>
  );
}
