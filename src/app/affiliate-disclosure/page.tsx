import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Info, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Affiliate & Partnership Disclosure Policy',
  description: 'Full transparency regarding our affiliate partnerships, Amazon Associates participation, and merchant referral relationships.'
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Affiliate Disclosure' }]} />

      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
          Legal & FTC Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Affiliate & Commercial Disclosure
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          In compliance with the FTC guides concerning the use of endorsements and testimonials in advertising, this policy outlines our commercial relationships with external merchants.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Amazon Clause Highlight */}
        <section className="bg-amber-500/10 border border-amber-500/30 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-xs">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Amazon Associates Operating Agreement Notice</span>
          </div>
          <p className="font-serif text-lg font-bold text-amber-100">
            &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
          </p>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            EveryAge Digital is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated international Amazon storefronts.
          </p>
        </section>

        {/* Other Networks */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="font-serif text-xl font-bold text-white">
            Other Affiliate Networks & Direct Brands
          </h2>
          <p>
            In addition to Amazon, EveryAge Digital partners with digital product platforms (such as Gumroad), affiliate networks (including Impact, CJ, ShareASale), and direct manufacturers. When you click an external merchant link and complete a purchase, the merchant may pay us a commission.
          </p>
          <p>
            This compensation comes directly from the merchant’s marketing budget and <strong className="text-white">never increases the purchase price</strong> you pay.
          </p>
        </section>

        {/* Core Promises */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="font-serif text-xl font-bold text-white">
            Our Strict Independence Commitments
          </h2>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Commission Rates Are Excluded From Ranking:</strong> Our recommendation algorithms and editorial choices rank strictly by user suitability, build quality, and verified value—never by commission percentage.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Transparent Link Attribution:</strong> We use direct, uncloaked outbound links with rel=&ldquo;sponsored nofollow noopener&rdquo; so you always know which merchant fulfills your order.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Explicit Sponsorship Badges:</strong> If an entity pays for editorial placement or placement amplification, it is prominently labeled with a &ldquo;Sponsored&rdquo; tag.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
