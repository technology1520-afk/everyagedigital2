'use client';

import React from 'react';
import { Scale, Check } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

interface CompareButtonProps {
  productId: string;
  className?: string;
  variant?: 'icon' | 'labeled';
}

export function CompareButton({
  productId,
  className = '',
  variant = 'icon'
}: CompareButtonProps) {
  const { isProductInCompare, toggleCompareProduct } = useWishlist();
  const inCompare = isProductInCompare(productId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompareProduct(productId);
  };

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={inCompare ? 'Remove from comparison' : 'Add to comparison'}
        aria-pressed={inCompare}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border backdrop-blur-md transition-all cursor-pointer min-h-[44px] ${
          inCompare
            ? 'bg-purple-600/10 text-purple-900 border-purple-300 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/40'
            : 'bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-purple-200/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
        } ${className}`}
      >
        {inCompare ? <Check className="w-3.5 h-3.5 text-purple-600 dark:text-blue-400" /> : <Scale className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
        {inCompare ? 'Added to Compare' : 'Compare'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={inCompare ? 'Remove from comparison' : 'Add to comparison (up to 4)'}
      aria-pressed={inCompare}
      title={inCompare ? 'Remove from compare' : 'Compare product'}
      className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-xs ${
        inCompare
          ? 'bg-purple-600/20 text-purple-800 border-purple-400 dark:bg-blue-600/30 dark:text-blue-300 dark:border-blue-500/50'
          : 'bg-white/80 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-purple-200/60 dark:border-white/20 hover:bg-white dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-white'
      } ${className}`}
    >
      <Scale className="w-4 h-4" />
    </button>
  );
}
