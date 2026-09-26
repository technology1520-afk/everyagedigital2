'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  Boxes, 
  Search, 
  X, 
  Check, 
  Layers,
  Sparkles,
  ExternalLink,
  Package
} from 'lucide-react';
import { Collection, Product } from '../../types';
import { 
  createCollectionAction, 
  updateCollectionAction, 
  deleteCollectionAction 
} from '../../app/actions/admin';

interface CollectionsManagerProps {
  initialCollections: Collection[];
  activeProducts: Product[];
}

export function CollectionsManager({
  initialCollections,
  activeProducts
}: CollectionsManagerProps) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [productPickerSearch, setProductPickerSearch] = useState('');

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
    setFormCoverImage('https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80');
    setFormStatus('published');
    setSelectedProductIds(new Set());
    setProductPickerSearch('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setEditingCollection(col);
    setFormTitle(col.title);
    setFormSlug(col.slug);
    setFormDescription(col.introduction || col.subtitle || '');
    setFormCoverImage(col.coverImage || '');
    setFormStatus(col.status || 'published');
    setSelectedProductIds(new Set(col.productIds || []));
    setProductPickerSearch('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingCollection) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormSlug(generated);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const selectAllProducts = () => {
    setSelectedProductIds(new Set(activeProducts.map(p => p.id)));
  };

  const clearAllProducts = () => {
    setSelectedProductIds(new Set());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formTitle.trim()) {
      setErrorMessage('Bundle title is required.');
      return;
    }
    if (!formSlug.trim()) {
      setErrorMessage('Bundle slug is required.');
      return;
    }

    startTransition(async () => {
      const payload = {
        title: formTitle.trim(),
        slug: formSlug.trim(),
        description: formDescription.trim(),
        coverImage: formCoverImage.trim(),
        status: formStatus,
        productIds: Array.from(selectedProductIds)
      };

      if (editingCollection) {
        const res = await updateCollectionAction(editingCollection.id, payload);
        if (res.success && res.collection) {
          setCollections(prev => prev.map(c => c.id === editingCollection.id ? res.collection! : c));
          setIsModalOpen(false);
        } else {
          setErrorMessage(res.error || 'Failed to update bundle.');
        }
      } else {
        const res = await createCollectionAction(payload);
        if (res.success && res.collection) {
          setCollections(prev => [res.collection!, ...prev]);
          setIsModalOpen(false);
        } else {
          setErrorMessage(res.error || 'Failed to create bundle.');
        }
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the bundle "${title}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCollectionAction(id);
      if (res.success) {
        setCollections(prev => prev.filter(c => c.id !== id && c.slug !== id));
      }
    });
  };

  const filteredCollections = collections.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || (c.introduction || '').toLowerCase().includes(q);
  });

  const filteredActiveProducts = activeProducts.filter(p => {
    const q = productPickerSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-purple-600 dark:text-blue-400" />
            <span>Curated Collections & Bundles</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Assemble multi-product gear setups, starter kits, and digital toolkits with instant multi-cart checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Bundle</span>
        </button>
      </div>

      {/* Search & Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bundles by title, slug, or theme..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 dark:focus:border-blue-400 backdrop-blur-md"
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 backdrop-blur-md justify-between">
          <span>Active Bundles: <strong className="text-slate-900 dark:text-white font-mono">{collections.length}</strong></span>
          <span className="text-slate-400">|</span>
          <span>Catalog Items: <strong className="text-slate-900 dark:text-white font-mono">{activeProducts.length}</strong></span>
        </div>
      </div>

      {/* Collections Glassmorphism Table */}
      <div className="bg-white/75 dark:bg-slate-900/60 backdrop-blur-2xl rounded-2xl border border-purple-200/50 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-purple-100 dark:border-white/10 bg-slate-50/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Bundle Info</th>
                <th className="py-3 px-4">Slug Route</th>
                <th className="py-3 px-4 text-center">Included Items</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 dark:divide-white/5">
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No curated collections found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCollections.map(col => {
                  const activeProductIds = new Set(activeProducts.map(p => p.id));
                  const activeProductCount = (col.productIds || []).filter(id => activeProductIds.has(id)).length;
                  return (
                    <tr key={col.id} className="hover:bg-purple-50/40 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {col.coverImage ? (
                            <img
                              src={col.coverImage}
                              alt={col.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-slate-800 flex items-center justify-center text-purple-600 dark:text-blue-400 shrink-0">
                              <Boxes className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {col.title}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {col.introduction || col.subtitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <Link
                          href={`/collections/${col.slug}`}
                          target="_blank"
                          className="text-purple-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>/collections/{col.slug}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {activeProductCount > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-blue-500/10 dark:text-blue-300">
                            {activeProductCount} {activeProductCount === 1 ? 'item' : 'items'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50">
                            <span>Empty (Hidden on Storefront)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                          col.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {col.status || 'published'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/collections/${col.slug}`}
                            target="_blank"
                            title="View Live Storefront"
                            className="p-1.5 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-lg hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(col)}
                            title="Edit Bundle"
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 rounded-lg hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(col.id, col.title)}
                            disabled={isPending}
                            title="Delete Bundle"
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Modal: Create / Edit Bundle */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingCollection ? 'Edit Curated Bundle' : 'Create New Curated Bundle'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Define metadata and attach active products for live multi-cart checkout.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Modal Form Scrollable Content */}
            <form id="bundle-form" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                    Bundle Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="e.g. Ergonomic Desk Essentials"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 dark:focus:border-blue-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                    Slug Route *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={e => setFormSlug(e.target.value)}
                    placeholder="e.g. ergonomic-desk-essentials"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                  Introduction / Editorial Context
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Explain why these items were curated together..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 dark:focus:border-blue-400"
                />
              </div>

              {/* Cover Image & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formCoverImage}
                    onChange={e => setFormCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 dark:focus:border-blue-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 dark:focus:border-blue-400 [&>option]:bg-slate-900 [&>option]:text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Multi-select product picker */}
              <div className="space-y-2 pt-2 border-t border-purple-100 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-purple-600 dark:text-blue-400" />
                    <span>Select Products Included in this Bundle ({selectedProductIds.size} selected)</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={selectAllProducts}
                      className="text-purple-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={clearAllProducts}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Product Search Filter */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={productPickerSearch}
                    onChange={e => setProductPickerSearch(e.target.value)}
                    placeholder="Filter products by name or category..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
                  />
                </div>

                {/* Scrollable Products Checkbox List */}
                <div className="max-h-56 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10">
                  {filteredActiveProducts.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-400">
                      No active products match your search.
                    </p>
                  ) : (
                    filteredActiveProducts.map(p => {
                      const isChecked = selectedProductIds.has(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleProduct(p.id)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                            isChecked
                              ? 'bg-purple-100/70 dark:bg-blue-600/20 border border-purple-300/60 dark:border-blue-500/30'
                              : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent onClick
                              className="w-4 h-4 rounded text-purple-600 dark:text-blue-500 border-slate-300 focus:ring-0 shrink-0"
                            />
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-white/10 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-white block truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                {p.category} {p.brand ? `• ${p.brand}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0 pl-2">
                            <span className="font-bold text-slate-900 dark:text-white font-mono">
                              ${typeof p.priceMin === 'number' ? p.priceMin.toFixed(2) : '0.00'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </form>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-purple-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="bundle-form"
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'Saving...' : editingCollection ? 'Save Bundle Changes' : 'Create Bundle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
