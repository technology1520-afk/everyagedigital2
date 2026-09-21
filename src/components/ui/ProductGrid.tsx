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
      <div className="py-16 text-center border border-dashed border-neutral-300 rounded-xl bg-white/50 p-8">
        <p className="text-neutral-600 font-medium">{emptyMessage}</p>
        <p className="text-xs text-neutral-400 mt-1">
          Try loosening your search terms or clearing selected merchant/category filters.
        </p>
      </div>
    );
  }

  const colClasses = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    4: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
  };

  return (
    <div className={colClasses[columns]}>
      {items.map(item => (
        <ProductCard key={item.product.id} item={item} />
      ))}
    </div>
  );
}
