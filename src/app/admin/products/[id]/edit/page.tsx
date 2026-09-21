import React from 'react';
import { notFound } from 'next/navigation';
import { catalogRepository } from '../../../../../lib/db/repository';
import { ProductForm } from '../../../../../components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function AdminEditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = catalogRepository.getProductById(id);

  if (!product) {
    notFound();
  }

  const categories = catalogRepository.getCategories();
  const offer = catalogRepository.getOfferForProduct(id);

  return (
    <div className="py-2">
      <ProductForm
        isEditing
        categories={categories}
        initialData={{
          id: product.id,
          title: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.category,
          merchantId: offer ? offer.merchantName : 'Amazon',
          priceMin: offer ? offer.price : 99,
          priceMax: offer?.originalPrice,
          currency: offer ? offer.currency : 'USD',
          imageUrl: product.imageUrl,
          affiliateUrl: offer ? offer.affiliateUrl : 'https://amazon.com',
          status: product.status,
          isOwned: product.productType === 'digital',
          bestFor: product.bestFor,
          notFor: product.notFor,
          editorialBadge: product.editorialBadge
        }}
      />
    </div>
  );
}
