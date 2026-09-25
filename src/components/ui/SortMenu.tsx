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
      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
      <label htmlFor="sort-select" className="text-xs text-slate-400 font-medium">
        Sort:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={e => onChange(e.target.value as SortOption)}
        className="text-xs bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-200 font-medium focus:outline-hidden focus:border-blue-400 cursor-pointer backdrop-blur-md"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
