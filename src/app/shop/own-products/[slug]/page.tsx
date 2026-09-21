import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOwnedProductBySlug, getAllOwnedProducts } from '../../../../lib/search/catalogSearch';
import { OwnedProductClientView } from '../../../../components/shop/OwnedProductClientView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllOwnedProducts();
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getOwnedProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} — EveryAge Digital Publications`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.tagline,
      images: [{ url: product.coverImage }]
    }
  };
}

export default async function OwnedProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getOwnedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <OwnedProductClientView product={product} />;
}
