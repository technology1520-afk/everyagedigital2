import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories } from '../../../lib/search/catalogSearch';
import { ShopMarketplace } from '../../../components/shop/ShopMarketplace';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(cat => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = getAllCategories();
  const category = categories.find(c => c.slug === slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Essentials & Recommendations`,
    description: `Explore vetted ${category.name.toLowerCase()} products and practical tools curated with independent editorial standards.`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = getAllCategories();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading category...</div>}>
      <ShopMarketplace initialCategory={category.name} />
    </Suspense>
  );
}
