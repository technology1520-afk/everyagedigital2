import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Clock
} from 'lucide-react';
import { catalogRepository } from '../../../lib/db/repository';
import { deleteProductAction } from '../../actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; category?: string; merchant?: string; stale?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || 'all';
  const categoryFilter = params.category || 'all';
  const merchantFilter = params.merchant || 'all';
  const staleOnly = params.stale === 'true';

  const products = catalogRepository.getProducts({
    status: statusFilter,
    category: categoryFilter,
    merchant: merchantFilter,
    staleOnly
  });

  const categories = catalogRepository.getCategories();
  const offers = catalogRepository.getOffers();
  const links = catalogRepository.getLinks();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Curated Products Inventory
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage tested hardware, software tools, and compliant affiliate offers.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800">Status:</span>
            <div className="flex items-center bg-[#F7F7F4] border border-neutral-200 rounded-lg p-0.5 text-xs">
              {['all', 'active', 'draft', 'paused', 'archived'].map(st => (
                <Link
                  key={st}
                  href={`/admin/products?status=${st}&category=${categoryFilter}&merchant=${merchantFilter}`}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {st}
                </Link>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800">Category:</span>
            <div className="flex items-center bg-[#F7F7F4] border border-neutral-200 rounded-lg p-0.5 text-xs overflow-x-auto">
              <Link
                href={`/admin/products?status=${statusFilter}&category=all&merchant=${merchantFilter}`}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All
              </Link>
              {categories.slice(0, 4).map(c => (
                <Link
                  key={c.id}
                  href={`/admin/products?status=${statusFilter}&category=${encodeURIComponent(c.name)}&merchant=${merchantFilter}`}
                  className={`px-2.5 py-1 rounded font-medium transition-colors truncate max-w-[140px] ${
                    categoryFilter.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stale Price Filter Toggle */}
        <Link
          href={`/admin/products?status=${statusFilter}&category=${categoryFilter}&stale=${staleOnly ? 'false' : 'true'}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            staleOnly
              ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
              : 'bg-[#F7F7F4] text-neutral-700 border-neutral-200 hover:bg-neutral-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>Stale Prices Only</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F7F7F4] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No products found matching the current filters.
                  </td>
                </tr>
              ) : (
                products.map(p => {
                  const offer = offers.find(o => o.productId === p.id);
                  const link = links.find(l => l.productId === p.id);
                  const clickCount = link ? link.clickCount : 0;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Product details with thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-neutral-900 truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-400 truncate">
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-neutral-700 whitespace-nowrap">
                        {p.category}
                      </td>

                      {/* Merchant */}
                      <td className="py-3 px-4 text-neutral-700 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <span>{offer ? offer.merchantName : 'Direct'}</span>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-semibold text-neutral-900 whitespace-nowrap">
                        ${offer ? offer.price.toFixed(2) : '0.00'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : p.status === 'paused'
                              ? 'bg-neutral-100 text-neutral-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Clicks */}
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                        {clickCount}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            title="View on Storefront"
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            title="Edit Product"
                            className="p-1.5 text-neutral-600 hover:text-[#234F9E] rounded hover:bg-neutral-100 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          {/* Soft Delete */}
                          <form
                            action={async () => {
                              'use server';
                              deleteProductAction(p.id);
                            }}
                          >
                            <button
                              type="submit"
                              title="Delete Product"
                              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
