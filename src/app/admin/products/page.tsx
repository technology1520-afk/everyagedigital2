import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  ExternalLink, 
  Edit, 
  Clock
} from 'lucide-react';
import { catalogRepository } from '../../../lib/db/repository';
import { DeleteProductButton } from '../../../components/admin/DeleteProductButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const products = await catalogRepository.getAllProducts({
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Curated Products Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage tested hardware, software tools, and compliant affiliate offers.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">Status:</span>
            <div className="flex items-center bg-slate-200/40 dark:bg-slate-800/40 border border-white/40 dark:border-white/10 rounded-xl p-0.5 text-xs backdrop-blur-md">
              {['all', 'active', 'draft', 'paused', 'archived'].map(st => (
                <Link
                  key={st}
                  href={`/admin/products?status=${st}&category=${categoryFilter}&merchant=${merchantFilter}`}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </Link>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">Category:</span>
            <div className="flex items-center bg-slate-200/40 dark:bg-slate-800/40 border border-white/40 dark:border-white/10 rounded-xl p-0.5 text-xs backdrop-blur-md overflow-x-auto">
              <Link
                href={`/admin/products?status=${statusFilter}&category=all&merchant=${merchantFilter}`}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </Link>
              {categories.slice(0, 4).map(c => (
                <Link
                  key={c.id}
                  href={`/admin/products?status=${statusFilter}&category=${encodeURIComponent(c.name)}&merchant=${merchantFilter}`}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors truncate max-w-[140px] ${
                    categoryFilter.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-colors ${
            staleOnly
              ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/30 font-semibold'
              : 'bg-slate-200/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-white/40 dark:border-white/10 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Stale Prices Only</span>
        </Link>
      </div>

      {/* Mobile Stacked Cards (Phone) */}
      <div className="md:hidden space-y-3">
        {products.length === 0 ? (
          <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No products found matching the current filters.
          </div>
        ) : (
          products.map(p => {
            const offer = offers.find(o => o.productId === p.id);
            const link = links.find(l => l.productId === p.id);
            const clickCount = link ? link.clickCount : 0;

            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-4 space-y-3"
              >
                {/* Header: Thumbnail, Title, Status */}
                <div className="flex items-start gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-white/40 dark:border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">
                        {p.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                            : p.status === 'draft'
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                            : p.status === 'paused'
                            ? 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                            : 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                      {p.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      /{p.slug}
                    </div>
                  </div>
                </div>

                {/* Details row: Merchant, Price, Clicks */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 rounded-xl backdrop-blur-sm text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Merchant</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {offer ? offer.merchantName : 'Direct'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Price</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white block">
                      ${offer ? offer.price.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Clicks</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                      {clickCount}
                    </span>
                  </div>
                </div>

                {/* Actions row with touch targets >= 44px */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/20 dark:border-white/5">
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="touch-target flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-white/90 dark:hover:bg-slate-800/90 backdrop-blur-sm transition-colors min-h-[44px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>

                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="touch-target flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm min-h-[44px]"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <DeleteProductButton
                    productId={p.id}
                    productName={p.name}
                    variant="mobile"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop/Tablet Products Table (hidden on phone, visible md+) */}
      <div className="hidden md:block rounded-2xl backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-white/20 dark:divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No products found matching the current filters.
                  </td>
                </tr>
              ) : (
                products.map(p => {
                  const offer = offers.find(o => o.productId === p.id);
                  const link = links.find(l => l.productId === p.id);
                  const clickCount = link ? link.clickCount : 0;

                  return (
                    <tr key={p.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Product details with thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-white/40 dark:border-white/10 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {p.category}
                      </td>

                      {/* Merchant */}
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <span>{offer ? offer.merchantName : 'Direct'}</span>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        ${offer ? offer.price.toFixed(2) : '0.00'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                              : p.status === 'draft'
                              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                              : p.status === 'paused'
                              ? 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                              : 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Clicks */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {clickCount}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3 px-4 text-slate-400 dark:text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            title="View on Storefront"
                            className="touch-target p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors min-h-[36px] min-w-[36px] inline-flex items-center justify-center"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            title="Edit Product"
                            className="touch-target p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors min-h-[36px] min-w-[36px] inline-flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete with confirmation dialog */}
                          <DeleteProductButton
                            productId={p.id}
                            productName={p.name}
                            variant="table"
                          />
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
