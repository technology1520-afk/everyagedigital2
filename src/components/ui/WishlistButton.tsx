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
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
          isSaved
            ? 'bg-amber-50 text-amber-900 border-amber-300'
            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
        } ${className}`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : 'text-neutral-500'}`} />
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
      className={`p-2 rounded-full border transition-colors cursor-pointer ${
        isSaved
          ? 'bg-amber-50 text-amber-600 border-amber-300'
          : 'bg-white/90 text-neutral-600 border-neutral-200/80 hover:bg-white hover:text-black shadow-xs'
      } ${className}`}
    >
      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : 'text-neutral-600'}`} />
    </button>
  );
}
