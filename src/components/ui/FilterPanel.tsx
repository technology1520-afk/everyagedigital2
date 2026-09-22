'use client';

import React from 'react';
import { FilterParams } from '../../types';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterParams;
  onChange: (newFilters: FilterParams) => void;
  availableCategories: string[];
  availableMerchants: string[];
  categoryCounts?: Record<string, number>;
  typeCounts?: Record<string, number>;
  merchantCounts?: Record<string, number>;
  className?: string;
}

export function FilterPanel({
  filters,
  onChange,
  availableCategories,
  availableMerchants,
  categoryCounts,
  typeCounts,
  merchantCounts,
  className = ''
}: FilterPanelProps) {
  const handleCategorySelect = (cat: string) => {
    onChange({
      ...filters,
      category: filters.category === cat ? undefined : cat
    });
  };

  const handleMerchantSelect = (merchant: string) => {
    onChange({
      ...filters,
      merchant: filters.merchant === merchant ? undefined : merchant
    });
  };

  const handleTypeSelect = (type: string) => {
    onChange({
      ...filters,
      productType: filters.productType === type ? undefined : type
    });
  };

  const clearAll = () => {
    onChange({
      query: filters.query,
      sortBy: filters.sortBy
    });
  };

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.merchant ||
    filters.productType ||
    filters.editorialPickOnly ||
    filters.maxPrice !== undefined
  );

  return (
    <aside className={`filters-card bg-white border border-[#E4E7EC] rounded-xl p-5 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
          <Filter className="w-3.5 h-3.5 text-[#234F9E]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-[#234F9E] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <X className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Editorial Pick Toggle */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-neutral-800">
          <input
            type="checkbox"
            checked={Boolean(filters.editorialPickOnly)}
            onChange={e => onChange({ ...filters, editorialPickOnly: e.target.checked || undefined })}
            className="rounded border-neutral-300 text-[#234F9E] focus:ring-[#234F9E]"
          />
          <span>Editorial Picks Only</span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h4>CATEGORY</h4>
        <div className="space-y-1 mt-2">
          {availableCategories.map(cat => {
            const isSelected = filters.category?.toLowerCase() === cat.toLowerCase();
            const count = categoryCounts?.[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`filter-link w-full text-left cursor-pointer ${isSelected ? 'selected' : ''}`}
              >
                <span>{cat}</span>
                <span className="filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Type (Physical vs Digital) */}
      <div>
        <h4>FORMAT / TYPE</h4>
        <div className="space-y-1 mt-2">
          {[
            { label: 'Physical Products', value: 'physical', count: typeCounts?.['physical'] ?? 0 },
            { label: 'Digital Templates & Downloads', value: 'digital', count: typeCounts?.['digital'] ?? 0 },
            { label: 'PDF Guides', value: 'pdf_guide', count: typeCounts?.['pdf_guide'] ?? 0 }
          ].map(type => {
            const isSelected = filters.productType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeSelect(type.value)}
                className={`filter-link w-full text-left cursor-pointer ${isSelected ? 'selected' : ''}`}
              >
                <span>{type.label}</span>
                <span className="filter-count">({type.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Merchants */}
      <div>
        <h4>MERCHANT</h4>
        <div className="space-y-1 mt-2">
          {availableMerchants.map(merchant => {
            const isSelected = filters.merchant?.toLowerCase() === merchant.toLowerCase();
            const count = merchantCounts?.[merchant] ?? 0;
            return (
              <button
                key={merchant}
                type="button"
                onClick={() => handleMerchantSelect(merchant)}
                className={`filter-link w-full text-left cursor-pointer ${isSelected ? 'selected' : ''}`}
              >
                <span>{merchant}</span>
                <span className="filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4>MAX BUDGET</h4>
          <span className="text-xs font-medium text-neutral-700">
            {filters.maxPrice ? `$${filters.maxPrice}` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="15"
          max="400"
          step="10"
          value={filters.maxPrice ?? 400}
          onChange={e => {
            const val = Number(e.target.value);
            onChange({ ...filters, maxPrice: val >= 400 ? undefined : val });
          }}
          className="w-full accent-[#234F9E] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
          <span>$15</span>
          <span>$200</span>
          <span>$400+</span>
        </div>
      </div>
    </aside>
  );
}
