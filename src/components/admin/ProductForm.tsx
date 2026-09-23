'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon
} from 'lucide-react';
import { ProductInput, ProductStatus } from '../../lib/db/schema';
import { createProductAction, updateProductAction } from '../../app/actions/admin';

interface ProductFormProps {
  initialData?: Partial<ProductInput> & { id?: string };
  categories: { id: string; name: string }[];
  isEditing?: boolean;
}

export function ProductForm({ initialData, categories, isEditing = false }: ProductFormProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.name || 'Desk Setup & Lighting');
  const [merchantId, setMerchantId] = useState(initialData?.merchantId || 'Amazon');
  const [priceMin, setPriceMin] = useState<number | string>(() => {
    if (initialData?.priceMin !== undefined && initialData?.priceMin !== null) {
      const num = Number(initialData.priceMin);
      return !isNaN(num) ? num : 0;
    }
    return 99;
  });
  const [priceMax, setPriceMax] = useState<number | string>(() => {
    if (initialData?.priceMax !== undefined && initialData?.priceMax !== null) {
      const num = Number(initialData.priceMax);
      return !isNaN(num) ? num : '';
    }
    return 129;
  });
  const [currency] = useState(initialData?.currency || 'USD');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80');
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliateUrl || 'https://www.amazon.com/dp/B00EXAMPLE?tag=everyagedigital-20');
  const [status, setStatus] = useState<ProductStatus>(initialData?.status || 'active');
  const [bestFor, setBestFor] = useState(initialData?.bestFor || 'Professionals and creators demanding reliable build quality.');
  const [notFor, setNotFor] = useState(initialData?.notFor || 'Budget-restricted buyers looking for disposable alternatives.');
  const [editorialBadge, setEditorialBadge] = useState<string>(initialData?.editorialBadge || "Editor's Choice");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');

  // UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-slug generator
  function handleTitleChange(val: string) {
    setTitle(val);
    if (autoSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanMin = priceMin === '' || isNaN(Number(priceMin)) ? 0 : Math.max(0, Number(priceMin));
    const cleanMax = priceMax === '' || isNaN(Number(priceMax)) ? undefined : Math.max(0, Number(priceMax));

    const payload: ProductInput = {
      title,
      slug,
      description,
      categoryId,
      merchantId,
      priceMin: cleanMin,
      priceMax: cleanMax,
      currency,
      imageUrl,
      affiliateUrl,
      status,
      isOwned: false,
      bestFor,
      notFor,
      editorialBadge: editorialBadge || undefined,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined
    };

    try {
      if (isEditing && initialData?.id) {
        const res = await updateProductAction(initialData.id, payload);
        if (res.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push('/admin/products');
            router.refresh();
          }, 800);
        } else {
          setError(res.error || 'Failed to update product');
        }
      } else {
        const res = await createProductAction(payload);
        if (res.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push('/admin/products');
            router.refresh();
          }, 800);
        } else {
          setError(res.error || 'Failed to create product');
        }
      }
    } catch {
      setError('An unexpected error occurred while saving.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20 lg:pb-0">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              {isEditing ? `Edit Product: ${title || 'Draft'}` : 'Add New Curated Product'}
            </h1>
            <p className="text-xs text-neutral-500">
              {isEditing ? 'Update catalog metadata and merchant offers' : 'Publish a new vetted affiliate offer to EveryAge Digital'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStatus('draft');
            }}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              status === 'draft'
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            Draft Mode
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving to Catalog...' : isEditing ? 'Update & Publish' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Product successfully saved and synchronized across storefront routes!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Product Info (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Core Identification */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              1. Catalog Identity & SEO Slug
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. BenQ ScreenBar Pro Monitor Light"
                className="w-full px-3 py-2 text-sm bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] focus:bg-white text-neutral-900"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-neutral-800">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] text-[#234F9E] hover:underline"
                >
                  {autoSlug ? 'Lock auto-generator' : 'Auto-sync from title'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">/product/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => {
                    setAutoSlug(false);
                    setSlug(e.target.value);
                  }}
                  placeholder="benq-screenbar-pro"
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] focus:bg-white text-neutral-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                Editorial Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide a clear, objective editorial summary highlighting utility, build quality, and tested performance..."
                className="w-full px-3 py-2 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] focus:bg-white text-neutral-900"
              />
            </div>
          </div>

          {/* Card 2: Editorial Verdict (Best For / Not For) */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              2. Editorial Stance & Testing Verdict
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-emerald-900">
                  Best For (Ideal Shopper Profile)
                </label>
                <textarea
                  rows={2}
                  value={bestFor}
                  onChange={e => setBestFor(e.target.value)}
                  placeholder="e.g. Remote software developers and designers working long desk hours."
                  className="w-full px-3 py-2 text-xs bg-emerald-50/30 border border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-600 text-neutral-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-amber-900">
                  Not Ideal For (Honest Limitation)
                </label>
                <textarea
                  rows={2}
                  value={notFor}
                  onChange={e => setNotFor(e.target.value)}
                  placeholder="e.g. Laptops with ultra-thin bezels or users wanting RGB lighting."
                  className="w-full px-3 py-2 text-xs bg-amber-50/30 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-600 text-neutral-900"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-neutral-800">
                Editorial Badge / Distinction
              </label>
              <select
                value={editorialBadge}
                onChange={e => setEditorialBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              >
                <option value="Editor's Choice">Editor&apos;s Choice</option>
                <option value="Best Value">Best Value</option>
                <option value="Premium Pick">Premium Pick</option>
                <option value="">No Special Badge</option>
              </select>
            </div>
          </div>

          {/* Card 3: SEO Meta */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              3. SEO Search Snippet Preview
            </h2>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-800">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  placeholder={title ? `${title} | Review & Live Offers` : 'Title | EveryAge Digital'}
                  className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-800">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  placeholder="Honest review, tested performance data, and live merchant pricing."
                  className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings: Merchant, Affiliate Link, Media, Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Status & Categorization */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Publishing & Category
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3 py-2 text-xs font-semibold bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
              >
                <option value="active">Active (Visible on Storefront)</option>
                <option value="draft">Draft (Private in Admin)</option>
                <option value="paused">Paused (Temporarily Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                Primary Category
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card: Merchant & Outbound Affiliate Link */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Merchant & Affiliate Tag
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                Merchant / Partner
              </label>
              <select
                value={merchantId}
                onChange={e => setMerchantId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
              >
                <option value="Amazon">Amazon Associates</option>
                <option value="Gumroad">Gumroad Partner</option>
                <option value="Direct Partner">Direct Brand Program</option>
                <option value="Impact">Impact Radius</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                Affiliate Outbound URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={affiliateUrl}
                onChange={e => setAffiliateUrl(e.target.value)}
                placeholder="https://www.amazon.com/dp/... or https://gumroad.com/l/..."
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
              />
              <p className="text-[10px] text-neutral-500">
                Verified per network format. Storefront renders with <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">rel=&quot;sponsored nofollow noopener&quot;</code>.
              </p>
            </div>

            {/* Pricing Range */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-neutral-700">
                  Price Min ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={priceMin === 0 ? 0 : priceMin || ''}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') {
                      setPriceMin('');
                    } else {
                      const num = parseFloat(val);
                      setPriceMin(isNaN(num) ? 0 : num);
                    }
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-neutral-700">
                  Price Max ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priceMax === 0 ? 0 : priceMax || ''}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') {
                      setPriceMax('');
                    } else {
                      const num = parseFloat(val);
                      setPriceMax(isNaN(num) ? '' : num);
                    }
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
                />
              </div>
            </div>
          </div>

          {/* Card: Media & Live Image Preview */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Product Visual Media
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800">
                Image CDN URL
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
              />
            </div>

            {/* Image Preview Box */}
            <div className="relative aspect-video w-full bg-[#F0F1ED] rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title || 'Product Preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-neutral-400 flex flex-col items-center gap-1 text-xs">
                  <ImageIcon className="w-6 h-6" />
                  <span>Image preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Action on Mobile (lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-safe flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStatus('draft')}
          className="touch-target px-3.5 py-2.5 rounded-xl text-xs font-medium border border-neutral-200 bg-[#F7F7F4] text-neutral-700 hover:bg-neutral-100 transition-colors min-h-[44px]"
        >
          Draft Mode
        </button>

        <button
          type="submit"
          disabled={loading}
          className="touch-target flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-colors shadow-xs disabled:opacity-50 min-h-[44px]"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : isEditing ? 'Update & Publish' : 'Publish Product'}</span>
        </button>
      </div>
    </form>
  );
}
