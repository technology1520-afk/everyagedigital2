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
        <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          Legal & FTC Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Affiliate & Commercial Disclosure
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          In compliance with the FTC guides concerning the use of endorsements and testimonials in advertising, this policy outlines our commercial relationships with external merchants.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
        {/* Amazon Clause Highlight */}
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider text-xs">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Amazon Associates Operating Agreement Notice</span>
          </div>
          <p className="font-serif text-lg font-bold text-amber-950">
            &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
          </p>
          <p className="text-xs text-amber-900 leading-relaxed">
            EveryAge Digital is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated international Amazon storefronts.
          </p>
        </section>

        {/* Other Networks */}
        <section className="bg-white border border-[#E2E5EB] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Other Affiliate Networks & Direct Brands
          </h2>
          <p>
            In addition to Amazon, EveryAge Digital partners with digital product platforms (such as Gumroad), affiliate networks (including Impact, CJ, ShareASale), and direct manufacturers. When you click an external merchant link and complete a purchase, the merchant may pay us a commission.
          </p>
          <p>
            This compensation comes directly from the merchant’s marketing budget and <strong>never increases the purchase price</strong> you pay.
          </p>
        </section>

        {/* Core Promises */}
        <section className="bg-white border border-[#E2E5EB] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Our Strict Independence Commitments
          </h2>
          <ul className="space-y-3 text-xs text-neutral-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Commission Rates Are Excluded From Ranking:</strong> Our recommendation algorithms and editorial choices rank strictly by user suitability, build quality, and verified value—never by commission percentage.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Transparent Link Attribution:</strong> We use direct, uncloaked outbound links with rel=&ldquo;sponsored nofollow noopener&rdquo; so you always know which merchant fulfills your order.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Explicit Sponsorship Badges:</strong> If an entity pays for editorial placement or placement amplification, it is prominently labeled with a &ldquo;Sponsored&rdquo; tag.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
