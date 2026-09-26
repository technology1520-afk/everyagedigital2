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

  return (
    <div className="max-w-6xl mx-auto">
      <CollectionsManager 
        initialCollections={collections} 
        activeProducts={activeProducts} 
      />
    </div>
  );
}
