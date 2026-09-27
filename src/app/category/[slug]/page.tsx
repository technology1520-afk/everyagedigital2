import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getAllCategoriesAsync } from '../../../lib/search/catalogSearch';
import { catalogRepository } from '../../../lib/db/repository';
import { ShopMarketplace } from '../../../components/shop/ShopMarketplace';
import { CatalogSkeleton } from '../../../components/ui/CatalogSkeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = (await getAllCategoriesAsync()) || getAllCategories();
  const category = categories.find(c => c.slug === slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Essentials & Recommendations`,
    description: `Explore vetted ${category.name.toLowerCase()} products and practical tools curated with independent editorial standards.`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = (await getAllCategoriesAsync()) || getAllCategories();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    notFound();
  }

  const initialProducts = await catalogRepository.getAllProducts({ status: 'active' });
  const initialOffers = catalogRepository.getOffers();

  return (
    <Suspense fallback={<CatalogSkeleton cardCount={8} showHeader={false} />}>
      <ShopMarketplace initialProducts={initialProducts} initialOffers={initialOffers} initialCategory={category.name} />
    </Suspense>
  );
}
