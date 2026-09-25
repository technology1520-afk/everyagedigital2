import React from 'react';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  items: EnrichedProduct[];
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  items,
  emptyMessage = 'No products match your current selection.',
  columns = 3
}: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-lg border border-purple-100 dark:border-white/10 hover:border-purple-300 dark:hover:border-blue-400/40 shadow-sm dark:shadow-none p-12 text-center my-6">
        <p className="text-slate-900 dark:text-white font-bold text-base">{emptyMessage}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Try loosening your search terms or clearing selected merchant/category filters.
        </p>
      </div>
    );
  }

  // Mobile: 2 cols (gap 12px / gap-3)
  // Tablet: 3 cols (gap 16px / gap-4)
  // Desktop: 3-4 cols (gap 20px / gap-5)
  const colClasses = {
    2: 'grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:gap-5',
    3: 'grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:gap-5',
    4: 'grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5'
  };

  return (
    <div className={colClasses[columns]}>
      {items.map((item, idx) => (
        <ProductCard key={item.product.id} item={item} priority={idx < 2} />
      ))}
    </div>
  );
}
