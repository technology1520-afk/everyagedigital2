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
    <aside className={`rounded-3xl bg-white/65 dark:bg-slate-900/50 backdrop-blur-xl border border-purple-200/60 dark:border-white/10 text-slate-800 dark:text-slate-100 shadow-lg shadow-purple-950/5 p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-200/50 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-blue-400" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-purple-600 hover:text-purple-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <X className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Editorial Pick Toggle */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={Boolean(filters.editorialPickOnly)}
            onChange={e => onChange({ ...filters, editorialPickOnly: e.target.checked || undefined })}
            className="rounded border-purple-300 dark:border-white/20 bg-white/80 dark:bg-white/5 text-purple-600 dark:text-blue-600 focus:ring-purple-500 dark:focus:ring-blue-500"
          />
          <span>Editorial Picks Only</span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-blue-400 font-bold">CATEGORY</h4>
        <div className="space-y-1 mt-2.5">
          {availableCategories.map(cat => {
            const isSelected = filters.category?.toLowerCase() === cat.toLowerCase();
            const count = categoryCounts?.[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between min-h-[36px] ${
                  isSelected
                    ? 'bg-purple-600/10 text-purple-900 border border-purple-300/60 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/30 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-purple-100/50 border border-transparent dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Type (Physical vs Digital) */}
      <div>
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-blue-400 font-bold">FORMAT / TYPE</h4>
        <div className="space-y-1 mt-2.5">
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
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between min-h-[36px] ${
                  isSelected
                    ? 'bg-purple-600/10 text-purple-900 border border-purple-300/60 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/30 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-purple-100/50 border border-transparent dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <span>{type.label}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">({type.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Merchants */}
      <div>
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-blue-400 font-bold">MERCHANT</h4>
        <div className="space-y-1 mt-2.5">
          {availableMerchants.map(merchant => {
            const isSelected = filters.merchant?.toLowerCase() === merchant.toLowerCase();
            const count = merchantCounts?.[merchant] ?? 0;
            return (
              <button
                key={merchant}
                type="button"
                onClick={() => handleMerchantSelect(merchant)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between min-h-[36px] ${
                  isSelected
                    ? 'bg-purple-600/10 text-purple-900 border border-purple-300/60 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/30 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-purple-100/50 border border-transparent dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <span>{merchant}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-blue-400 font-bold">MAX BUDGET</h4>
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
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
          className="w-full accent-purple-600 dark:accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
          <span>$15</span>
          <span>$200</span>
          <span>$400+</span>
        </div>
      </div>
    </aside>
  );
}
