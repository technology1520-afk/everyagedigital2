'use client';

import React, { useState } from 'react';
import { OwnedProduct } from '../../types';
import { DemoCheckoutModal } from '../ui/DemoCheckoutModal';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  CreditCard 
} from 'lucide-react';

interface OwnedProductClientViewProps {
  product: OwnedProduct;
}

export function OwnedProductClientView({ product }: OwnedProductClientViewProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: 'Our Products', href: '/shop/own-products' },
          { label: product.title }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cover Media & Highlights */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative aspect-4/3 w-full bg-slate-950/60 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-lg shadow-xs">
              EveryAge Original
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3 text-xs shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Delivery Method</span>
              <span className="font-semibold text-slate-200">Instant Download + Link</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">File Formats</span>
              <span className="font-semibold text-slate-200">{product.fileFormat}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Scope</span>
              <span className="font-semibold text-slate-200">{product.pageCountOrModules}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Pricing & Demo Checkout */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Published by EveryAge Digital</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {product.title}
            </h1>
            <p className="text-sm font-medium text-slate-300 mt-2">
              {product.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing & Checkout Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 uppercase ml-1.5">{product.currency}</span>
              </div>
              <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full font-medium border border-emerald-500/40 backdrop-blur-md">
                One-Time Payment
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Open Checkout (${product.price.toFixed(2)})</span>
            </button>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                30-day money-back guarantee
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-blue-400" />
                Instant access
              </span>
            </div>
          </div>

          {/* Included Items Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              What Is Included:
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {product.includedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-white/[0.03] backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Refund Policy */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-1.5 text-xs text-slate-300 shadow-lg">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <RotateCcw className="w-4 h-4 text-blue-400" />
              <span>Direct Publisher Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {product.refundPolicy}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Checkout Modal */}
      <DemoCheckoutModal
        product={product}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
