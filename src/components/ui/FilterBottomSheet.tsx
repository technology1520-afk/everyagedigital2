'use client';

import React, { useEffect } from 'react';
import { FilterParams } from '../../types';
import { FilterPanel } from './FilterPanel';
import { X, Check } from 'lucide-react';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterParams;
  onChange: (newFilters: FilterParams) => void;
  availableCategories: string[];
  availableMerchants: string[];
  categoryCounts?: Record<string, number>;
  typeCounts?: Record<string, number>;
  merchantCounts?: Record<string, number>;
  totalResults: number;
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  filters,
  onChange,
  availableCategories,
  availableMerchants,
  categoryCounts,
  typeCounts,
  merchantCounts,
  totalResults
}: FilterBottomSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter Options"
        className="relative backdrop-blur-2xl bg-slate-950/95 text-slate-100 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl z-10 animate-in slide-in-from-bottom duration-250 border-t border-white/10"
      >
        {/* Drag Handle & Top Bar */}
        <div className="pt-3 pb-3 px-5 border-b border-white/10 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-white/20 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Catalog Filters</span>
              <span className="text-xs bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                {totalResults} items
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="touch-target p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Options */}
        <div className="overflow-y-auto p-5 space-y-6 flex-1">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            availableCategories={availableCategories}
            availableMerchants={availableMerchants}
            categoryCounts={categoryCounts}
            typeCounts={typeCounts}
            merchantCounts={merchantCounts}
            className="border-0 p-0 shadow-none bg-transparent"
          />
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center gap-3 pb-safe">
          <button
            type="button"
            onClick={() => {
              onChange({ query: filters.query, sortBy: filters.sortBy });
            }}
            className="touch-target flex-1 py-3 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="touch-target flex-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters ({totalResults})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
