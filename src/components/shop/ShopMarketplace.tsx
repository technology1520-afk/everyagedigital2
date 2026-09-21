'use client';

import React, { useState, useMemo } from 'react';
import { FilterParams } from '../../types';
import { searchCatalog } from '../../lib/search/catalogSearch';
import { ProductGrid } from '../ui/ProductGrid';
import { FilterPanel } from '../ui/FilterPanel';
import { SortMenu } from '../ui/SortMenu';
import { AffiliateDisclosure } from '../ui/AffiliateDisclosure';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Search } from 'lucide-react';

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

  const searchResult = useMemo(() => {
    return searchCatalog(filters);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Shop Marketplace' }]} />

      {/* Title Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E2E5EB]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
            Catalog Marketplace
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
            Curated Commerce Storefront
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Discover vetted everyday essentials, ergonomic tools, books, and digital systems.
          </p>
        </div>

        {/* Quick Search inside catalog */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={e => setFilters({ ...filters, query: e.target.value })}
            placeholder="Search items, brands, use cases..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E2E5EB] rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#1D438A]"
          />
        </div>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            availableCategories={searchResult.availableCategories}
            availableMerchants={searchResult.availableMerchants}
          />
        </div>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Item count + Sorting */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E5EB] flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-700">
              Showing <span className="text-neutral-900 font-bold">{searchResult.total}</span> curated item{searchResult.total === 1 ? '' : 's'}
            </span>
            <SortMenu
              currentSort={filters.sortBy || 'editorial_picks'}
              onChange={sort => setFilters({ ...filters, sortBy: sort })}
            />
          </div>

          {/* Grid */}
          <ProductGrid
            items={searchResult.items}
            columns={3}
            emptyMessage="No products match your filter criteria."
          />
        </div>
      </div>
    </div>
  );
}
