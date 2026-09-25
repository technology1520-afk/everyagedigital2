import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { XCircle, Clock, FileSearch, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Selection Methodology & Vetting Standards',
  description: 'Detailed explanation of how EveryAge Digital evaluates hardware, tools, books, and digital systems.'
};

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Methodology' }]} />

      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
          Testing & Curation Standards
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          How We Select and Evaluate Recommendations
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Every recommendation on EveryAge Digital must satisfy strict editorial vetting before being added to our catalog.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Step 1 */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
            <FileSearch className="w-4 h-4" />
            <span>Pillar 1</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-white">
            1. Primary Source Specification Auditing
          </h2>
          <p>
            We do not rely on marketing claims, retailer summaries, or influencer unboxings. Every physical product is benchmarked against its original manufacturer manual, electrical safety certifications (e.g. UL, CE, FCC), and engineering specifications.
          </p>
        </section>

        {/* Step 2 */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Pillar 2</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-white">
            2. Real-World Trade-Off Documentation
          </h2>
          <p>
            We mandate that every single product review document &ldquo;Not Ideal For&rdquo; limitations. If a product is heavy, requires proprietary software, or lacks ergonomic adaptability for left-handed users, we declare it prominently.
          </p>
        </section>

        {/* Step 3 */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Pillar 3</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-white">
            3. Honest Pricing & Freshness Invalidation
          </h2>
          <p>
            Online pricing is dynamic. We record the exact date and timestamp when an offer was checked. If an offer has not been audited within its validity window (e.g., 7 days for fast-moving retail), our system automatically hides the price and displays &ldquo;Check current price&rdquo; to avoid misleading shoppers.
          </p>
        </section>

        {/* Rejection Criteria */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="font-serif text-xl font-bold text-white">
            Automatic Disqualification Criteria
          </h2>
          <p className="text-xs text-slate-400">
            Products exhibiting any of the following traits are immediately rejected from our catalog:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Manipulated customer reviews or deceptive five-star campaigns on third-party marketplaces.</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Generic dropshipped white-label goods lacking verified warranty service.</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Exaggerated medical, health, or financial guarantee claims.</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Forced recurring subscription traps on products that should function as one-time utilities.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
