import React from 'react';
import { CatalogSkeleton } from '../components/ui/CatalogSkeleton';

export default function Loading() {
  return <CatalogSkeleton cardCount={8} showHeader={true} />;
}
