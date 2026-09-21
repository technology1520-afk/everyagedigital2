import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllOwnedProducts } from '../../../lib/search/catalogSearch';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'In-House Publications & Digital Products',
  description: 'Original PDF guides, legal templates, and Notion workspaces engineered directly by EveryAge Digital.'
};

export default function OwnProductsPage() {
  const products = getAllOwnedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: 'Our Products' }
        ]}
      />

      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D438A]/10 text-[#1D438A] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EveryAge Digital Original Publications</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Field Guides, Notion Systems & Contract Kits
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          Crafted in-house by our editors and domain specialists. Practical, actionable toolkits with zero ongoing monthly subscription fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map(prod => (
          <article
            key={prod.id}
            className="bg-white border border-[#E2E5EB] rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#1D438A]/40 transition-colors"
          >
            <div className="relative aspect-16/9 w-full bg-[#F0F1ED] overflow-hidden">
              <img
                src={prod.coverImage}
                alt={prod.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-800 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                Direct Download
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-2">
                  <span>Format: {prod.fileFormat}</span>
                  <span>{prod.pageCountOrModules}</span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-neutral-900">
                  <Link href={`/shop/own-products/${prod.slug}`} className="hover:text-[#1D438A] transition-colors">
                    {prod.title}
                  </Link>
                </h2>

                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {prod.description}
                </p>

                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    Included Items:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {prod.includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-neutral-900">
                    ${prod.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-500 uppercase ml-1">{prod.currency}</span>
                </div>

                <Link
                  href={`/shop/own-products/${prod.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D438A] text-white rounded-xl text-xs font-semibold hover:bg-[#153266] transition-colors shadow-xs"
                >
                  <span>Product Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
