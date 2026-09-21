import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import Link from 'next/link';
import { ShieldCheck, Target, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About EveryAge Digital — Publishing Mission & Standards',
  description: 'Learn about our editorial standards, independent discovery ethos, and how we curate products that genuinely work.'
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          Publisher & Mission
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Curated clearly. Recommended intelligently.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          EveryAge Digital was founded to cut through modern ecommerce noise, fabricated customer reviews, and low-quality drop-shipped listings.
        </p>
      </div>

      <div className="prose prose-neutral text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
        <section className="bg-white border border-[#E2E5EB] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            What We Do
          </h2>
          <p>
            We are an independent shopping publication and digital store. We research, test, and filter everyday physical essentials, books, and high-utility digital resources—such as Notion workspaces and commercial contract kits.
          </p>
          <p>
            When you explore our catalog, you will find direct links to purchase products on external merchant websites (such as Amazon, Gumroad, and direct manufacturers). We also author a select number of in-house digital guides.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E5EB] rounded-2xl p-6 space-y-2.5">
            <ShieldCheck className="w-6 h-6 text-[#1D438A]" />
            <h3 className="font-bold text-neutral-900 text-sm">No Bought Rankings</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We never accept money to rank one product above another. Paid placements are strictly labeled as &ldquo;Sponsored&rdquo; and excluded from organic editorial choices.
            </p>
          </div>

          <div className="bg-white border border-[#E2E5EB] rounded-2xl p-6 space-y-2.5">
            <Target className="w-6 h-6 text-[#1D438A]" />
            <h3 className="font-bold text-neutral-900 text-sm">Explicit Trade-Offs</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every single product card documents not only who the item is best for, but who should avoid it. No single tool is right for everyone.
            </p>
          </div>
        </section>

        <section className="bg-[#F0F1ED] border border-[#E2E5EB] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Affiliate Transparency
          </h2>
          <p>
            When you purchase through our links, merchants may pay us an affiliate commission. This never adds cost to your purchase. In fact, it allows us to operate without intrusive banner advertisements, popup popunders, or paywalled reviews.
          </p>
          <div className="pt-2">
            <Link
              href="/affiliate-disclosure"
              className="inline-flex items-center gap-1.5 font-semibold text-[#1D438A] hover:underline"
            >
              <span>Read our full Affiliate Disclosure Statement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
