'use client';

import React from 'react';
import { SortOption } from '../../types';
import { ArrowUpDown } from 'lucide-react';

interface SortMenuProps {
  currentSort: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export function SortMenu({ currentSort, onChange, className = '' }: SortMenuProps) {
  const options: { label: string; value: SortOption }[] = [
    { label: 'Editorial Picks', value: 'editorial_picks' },
    { label: 'Price: Low to High', value: 'price_low_high' },
    { label: 'Price: High to Low', value: 'price_high_low' },
    { label: 'Newest Reviews', value: 'newest_review' },
    { label: 'Recently Added', value: 'recently_added' },
    { label: 'Relevance', value: 'relevance' }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
      <label htmlFor="sort-select" className="text-xs text-neutral-500 font-medium">
        Sort:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={e => onChange(e.target.value as SortOption)}
        className="text-xs bg-white border border-[#E2E5EB] rounded-lg px-2.5 py-1.5 text-neutral-800 font-medium focus:outline-hidden focus:border-[#1D438A] cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
