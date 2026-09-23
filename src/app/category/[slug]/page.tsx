import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getAllCategoriesAsync } from '../../../lib/search/catalogSearch';
import { catalogRepository } from '../../../lib/db/repository';
import { ShopMarketplace } from '../../../components/shop/ShopMarketplace';

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

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading category...</div>}>
      <ShopMarketplace initialProducts={initialProducts} initialCategory={category.name} />
    </Suspense>
  );
}
