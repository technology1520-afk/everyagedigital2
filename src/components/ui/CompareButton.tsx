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
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono border transition-all cursor-pointer min-h-[40px] ${
          inCompare
            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white'
            : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/70 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-white'
        } ${className}`}
      >
        {inCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5 text-neutral-500" />}
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
      className={`h-7 w-7 rounded-md border transition-all cursor-pointer shadow-xs flex items-center justify-center ${
        inCompare
          ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white'
          : 'bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900 border-neutral-200 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-white dark:border-neutral-700'
      } ${className}`}
    >
      <Scale className="w-3.5 h-3.5" />
    </button>
  );
}
