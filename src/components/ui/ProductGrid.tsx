import React from 'react';
import { EnrichedProduct } from '../../lib/search/catalogSearch';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  items: EnrichedProduct[];
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
  className?: string;
  enableEditorialHierarchy?: boolean;
}

export function ProductGrid({
  items,
  emptyMessage = 'No products match your current selection.',
  columns,
  className = '',
  enableEditorialHierarchy = true
}: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 p-12 text-center my-6 shadow-xs">
        <p className="font-serif text-lg font-normal text-neutral-900 dark:text-neutral-100">{emptyMessage}</p>
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto">
          Try loosening search filters or resetting category tags to see verified specimens.
        </p>
      </div>
    );
  }

  // If editorial hierarchy is active, Card 0 spans 2 columns in a 3-column desktop rhythm
  const gridClass = columns === 2
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full';

  return (
    <div className={`${gridClass} ${className}`.trim()}>
      {items.map((item, idx) => {
        const isLead = enableEditorialHierarchy && idx === 0 && columns !== 2;
        return (
          <ProductCard
            key={item.product.id}
            item={item}
            index={idx}
            priority={idx < 2}
            isLead={isLead}
          />
        );
      })}
    </div>
  );
}

export default ProductGrid;
