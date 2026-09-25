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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EveryAge Digital Original Publications</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Field Guides, Notion Systems & Contract Kits
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Crafted in-house by our editors and domain specialists. Practical, actionable toolkits with zero ongoing monthly subscription fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map(prod => (
          <article
            key={prod.id}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-blue-400/40 hover:bg-slate-900/60 transition-all duration-300 group"
          >
            <div className="relative aspect-16/9 w-full bg-slate-950/60 overflow-hidden">
              <img
                src={prod.coverImage}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-lg">
                Direct Download
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                  <span>Format: {prod.fileFormat}</span>
                  <span>{prod.pageCountOrModules}</span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  <Link href={`/shop/own-products/${prod.slug}`}>
                    {prod.title}
                  </Link>
                </h2>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {prod.description}
                </p>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Included Items:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {prod.includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">
                    ${prod.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 uppercase ml-1">{prod.currency}</span>
                </div>

                <Link
                  href={`/shop/own-products/${prod.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
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
