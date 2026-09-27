import React from 'react';
import { CatalogSkeleton } from '../../components/ui/CatalogSkeleton';

export default function ShopLoading() {
  return <CatalogSkeleton cardCount={8} showHeader={true} />;
}
