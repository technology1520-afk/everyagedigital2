'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

interface WishlistButtonProps {
  productId?: string;
  bookId?: string;
  className?: string;
  variant?: 'icon' | 'labeled';
}

export function WishlistButton({
  productId,
  bookId,
  className = '',
  variant = 'icon'
}: WishlistButtonProps) {
  const { isProductSaved, toggleSaveProduct, isBookSaved, toggleSaveBook } = useWishlist();

  const isSaved = productId ? isProductSaved(productId) : bookId ? isBookSaved(bookId) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (productId) toggleSaveProduct(productId);
    else if (bookId) toggleSaveBook(bookId);
  };

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isSaved ? 'Remove from saved list' : 'Save for later'}
        aria-pressed={isSaved}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border backdrop-blur-md transition-all cursor-pointer min-h-[44px] ${
          isSaved
            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
            : 'bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-purple-200/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
        } ${className}`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
        {isSaved ? 'Saved to List' : 'Save for Later'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? 'Remove from saved list' : 'Save for later'}
      aria-pressed={isSaved}
      className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-xs ${
        isSaved
          ? 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300 border-amber-500/50'
          : 'bg-white/80 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-purple-200/60 dark:border-white/20 hover:bg-white dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-white'
      } ${className}`}
    >
      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-500' : 'text-slate-600 dark:text-slate-300'}`} />
    </button>
  );
}
