import React from 'react';
import { catalogRepository } from '../../../lib/db/repository';
import { CollectionsManager } from '../../../components/admin/CollectionsManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCollectionsPage() {
  const [collections, allProducts] = await Promise.all([
    catalogRepository.getAllCollections(),
    catalogRepository.getAllProducts(),
  ]);

  const activeProducts = allProducts.filter(p => p && p.status === 'active');
  const activeProductIds = new Set(activeProducts.map(p => p.id));

  const enrichedCollections = collections.map(col => ({
    ...col,
    activeProductCount: (col.productIds || []).filter(id => activeProductIds.has(id)).length
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <CollectionsManager 
        initialCollections={enrichedCollections} 
        activeProducts={activeProducts} 
      />
    </div>
  );
}
