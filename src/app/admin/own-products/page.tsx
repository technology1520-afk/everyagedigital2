import React from 'react';
import Link from 'next/link';
import { 
  FileBox, 
  ExternalLink, 
  CreditCard, 
  Save
} from 'lucide-react';
import { catalogRepository } from '../../../lib/db/repository';
import { updateOwnProductAction } from '../../actions/admin';

export const dynamic = 'force-dynamic';

export default function AdminOwnProductsPage() {
  const ownProducts = catalogRepository.getOwnProducts();

  async function handleUpdate(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const price = Number(formData.get('price'));
    const deliveryInfo = formData.get('deliveryInfo') as string;
    const refundPolicy = formData.get('refundPolicy') as string;
    const checkoutProvider = formData.get('checkoutProvider') as 'lemonsqueezy' | 'paddle' | 'demo';

    if (id) {
      await updateOwnProductAction(id, {
        title,
        price,
        deliveryInfo,
        refundPolicy,
        checkoutProvider
      });
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            In-House Digital Products & Merchant-of-Record
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure direct digital goods, checkout provider modes, delivery fulfillment, and refund policies.
          </p>
        </div>

        <Link
          href="/shop/own-products"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-semibold shadow-xs"
        >
          <span>View Public Digital Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </Link>
      </div>

      {/* Gateway Notice Box */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3">
        <CreditCard className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-900">
          <div className="font-semibold">
            Merchant-of-Record Provider Mode: Demo Active
          </div>
          <p className="text-amber-800 leading-relaxed">
            All purchases currently route through the built-in simulated sandbox. To switch to production payments, set <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-neutral-800">LEMON_SQUEEZY_API_KEY</code> or <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-neutral-800">PADDLE_VENDOR_ID</code> in environment variables.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        {ownProducts.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#234F9E]">
                  <FileBox className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    {p.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5 font-mono">
                    <span>/{p.slug}</span>
                    <span>•</span>
                    <span className="text-[#234F9E] font-semibold">{p.fileFormat}</span>
                    <span>•</span>
                    <span>{p.pageCountOrModules}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/shop/own-products/${p.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-[#234F9E] hover:underline font-semibold"
              >
                <span>Preview Product Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Edit Form */}
            <form action={handleUpdate} className="space-y-4">
              <input type="hidden" name="id" value={p.id} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={p.title}
                    required
                    className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Price (USD $)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={p.price}
                    required
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Checkout Gateway Provider
                  </label>
                  <select
                    name="checkoutProvider"
                    defaultValue={p.paymentProvider === 'Lemon Squeezy' ? 'lemonsqueezy' : p.paymentProvider === 'Paddle' ? 'paddle' : 'demo'}
                    className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900 font-semibold"
                  >
                    <option value="demo">Demo Sandbox (Default)</option>
                    <option value="lemonsqueezy">Lemon Squeezy (MoR)</option>
                    <option value="paddle">Paddle Billing (MoR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Delivery Info & Tagline
                  </label>
                  <input
                    type="text"
                    name="deliveryInfo"
                    defaultValue={p.tagline}
                    className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Refund & Guarantee Policy
                  </label>
                  <input
                    type="text"
                    name="refundPolicy"
                    defaultValue={p.refundPolicy}
                    className="w-full px-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-neutral-400">
                  Last updated {new Date(p.updatedAt).toLocaleDateString()}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Product Details</span>
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
