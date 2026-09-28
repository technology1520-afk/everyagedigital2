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
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono border transition-all cursor-pointer min-h-[40px] ${
          isSaved
            ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800'
            : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/70 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-white'
        } ${className}`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : 'text-neutral-500'}`} />
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
      className={`h-7 w-7 rounded-md border transition-all cursor-pointer shadow-xs flex items-center justify-center ${
        isSaved
          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700'
          : 'bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900 border-neutral-200 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-white dark:border-neutral-700'
      } ${className}`}
    >
      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 dark:fill-amber-400' : 'currentColor'}`} />
    </button>
  );
}
