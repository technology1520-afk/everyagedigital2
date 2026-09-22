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
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer min-h-[44px] ${
          inCompare
            ? 'bg-[#234F9E]/10 text-[#234F9E] border-[#234F9E]/30'
            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
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
      className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border transition-colors cursor-pointer ${
        inCompare
          ? 'bg-[#234F9E] text-white border-[#234F9E]'
          : 'bg-white/90 text-neutral-600 border-neutral-200/80 hover:bg-white hover:text-black'
      } ${className}`}
    >
      <Scale className="w-4 h-4" />
    </button>
  );
}
