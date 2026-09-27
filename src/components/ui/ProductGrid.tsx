import React from 'react';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  items: EnrichedProduct[];
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  items,
  emptyMessage = 'No products match your current selection.',
  columns,
  className = ''
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

  const gridClass = columns === 2
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full';

  return (
    <div className={`${gridClass} ${className}`.trim()}>
      {items.map((item, idx) => (
        <ProductCard key={item.product.id} item={item} index={idx} priority={idx < 2} />
      ))}
    </div>
  );
}

export default ProductGrid;
