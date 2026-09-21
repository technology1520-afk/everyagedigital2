import React from 'react';
import { catalogRepository } from '../../../../lib/db/repository';
import { ProductForm } from '../../../../components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default function AdminNewProductPage() {
  const categories = catalogRepository.getCategories();

  return (
    <div className="py-2">
      <ProductForm categories={categories} />
    </div>
  );
}
