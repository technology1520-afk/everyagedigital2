import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for EveryAge Digital describing our anonymous data handling and cookie policies.'
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          Legal Documentation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Last updated: March 20, 2026
        </p>
      </div>

      {/* Legal Review Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>[TODO: LEGAL COUNSEL REVIEW REQUIRED]</strong>
          <p className="mt-1 text-[11px] text-amber-800">
            This privacy policy placeholder outlines current technical data practices for EveryAge Digital and must be formally verified by qualified legal counsel prior to enterprise commercial expansion.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E5EB] rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">1. Information We Do Not Collect</h2>
          <p>
            EveryAge Digital does not require user account registration for browsing our catalog, comparing products, or saving items to your private wishlist. Wishlist items and comparison trays are stored locally in your browser’s localStorage and never transmitted to our remote servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">2. Outbound Links & Third-Party Cookies</h2>
          <p>
            When you click an affiliate link to an external merchant (e.g. Amazon, Gumroad, or partner brands), you leave EveryAge Digital. External merchants may deposit cookies on your device to attribute referral sales in accordance with their respective privacy policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">3. AI Shopping Receptionist Queries</h2>
          <p>
            Queries submitted to EveryAge Assistant are processed in real-time to match catalog metadata and are not retained as identifiable profiles. We do not sell conversational inputs to third-party data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">4. Email Newsletters</h2>
          <p>
            If you voluntarily subscribe to the EveryAge Dispatch newsletter, your email address is used exclusively to send curated weekly dispatches. You may unsubscribe at any time via the link included in each email.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">5. Contact Information</h2>
          <p>
            For privacy inquiries or deletion requests, contact privacy@everyagedigital.com.
          </p>
        </section>
      </div>
    </div>
  );
}
