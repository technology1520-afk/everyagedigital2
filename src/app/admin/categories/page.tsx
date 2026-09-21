import React from 'react';
import Link from 'next/link';
import { Plus, Trash2, ArrowUpRight, FolderTree } from 'lucide-react';
import { catalogRepository } from '../../../lib/db/repository';
import { createCategoryAction, deleteCategoryAction } from '../../actions/admin';

export const dynamic = 'force-dynamic';

export default function AdminCategoriesPage() {
  const categories = catalogRepository.getCategories();

  async function handleCreate(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const slug = (formData.get('slug') as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sortOrder = Number(formData.get('sortOrder') || categories.length);

    if (name) {
      await createCategoryAction({ name, slug, sortOrder });
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Taxonomy & Category Architecture
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Organize catalog products, browse routes, and navigation filters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Active Taxonomy Nodes ({categories.length})
            </h2>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F7F7F4] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug Route</th>
                <th className="py-3 px-4">Product Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-neutral-400">
                    {cat.sortOrder ?? idx}
                  </td>

                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    {cat.name}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="hover:text-[#234F9E] flex items-center gap-1"
                    >
                      <span>/category/{cat.slug}</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                    </Link>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#234F9E]">
                      {cat.productCount} items
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <form
                      action={async () => {
                        'use server';
                        deleteCategoryAction(cat.id);
                      }}
                    >
                      <button
                        type="submit"
                        title="Delete Category"
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Category Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4 h-fit">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#234F9E]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Add New Category
            </h2>
          </div>

          <form action={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Category Title
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Ergonomics & Desk Wellness"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Custom URL Slug (optional)
              </label>
              <input
                type="text"
                name="slug"
                placeholder="auto-generated-if-empty"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Sort Priority Order
              </label>
              <input
                type="number"
                name="sortOrder"
                defaultValue={categories.length}
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-colors shadow-xs mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Category</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
