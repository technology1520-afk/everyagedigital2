'use client';

import React from 'react';
import { FilterParams } from '../../types';
import { Filter, X, Check } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterParams;
  onChange: (newFilters: FilterParams) => void;
  availableCategories: string[];
  availableMerchants: string[];
  className?: string;
}

export function FilterPanel({
  filters,
  onChange,
  availableCategories,
  availableMerchants,
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
    <aside className={`bg-white border border-[#E2E5EB] rounded-xl p-5 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
          <Filter className="w-3.5 h-3.5 text-[#1D438A]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-[#1D438A] hover:underline flex items-center gap-1 cursor-pointer font-medium"
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
            className="rounded border-neutral-300 text-[#1D438A] focus:ring-[#1D438A]"
          />
          <span>Editorial Picks Only</span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-900 mb-2 uppercase tracking-wider text-[11px]">
          Category
        </h4>
        <div className="space-y-1">
          {availableCategories.map(cat => {
            const isSelected = filters.category?.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1D438A] text-white font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Type (Physical vs Digital) */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-900 mb-2 uppercase tracking-wider text-[11px]">
          Format / Type
        </h4>
        <div className="space-y-1">
          {[
            { label: 'Physical Products', value: 'physical' },
            { label: 'Digital Templates & Downloads', value: 'digital' },
            { label: 'PDF Guides', value: 'pdf_guide' }
          ].map(type => {
            const isSelected = filters.productType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeSelect(type.value)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1D438A] text-white font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{type.label}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Merchants */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-900 mb-2 uppercase tracking-wider text-[11px]">
          Merchant
        </h4>
        <div className="space-y-1">
          {availableMerchants.map(merchant => {
            const isSelected = filters.merchant?.toLowerCase() === merchant.toLowerCase();
            return (
              <button
                key={merchant}
                type="button"
                onClick={() => handleMerchantSelect(merchant)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1D438A] text-white font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{merchant}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
            Max Budget
          </h4>
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
          className="w-full accent-[#1D438A] cursor-pointer"
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
