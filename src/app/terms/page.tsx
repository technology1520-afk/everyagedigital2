import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for EveryAge Digital catalog and digital store.'
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          Legal Documentation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Terms of Service
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
            This terms of service document is a working placeholder outlining discovery terms, affiliate disclaimers, and digital product sales limitations. Formal counsel review is pending.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E5EB] rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing EveryAge Digital, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please discontinue using the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">2. Informational & Discovery Platform Only</h2>
          <p>
            Except for in-house publications sold in our &ldquo;Our Products&rdquo; section, EveryAge Digital does not sell, ship, inventory, or fulfill physical products. All affiliate transactions occur on external merchant websites governed by the respective merchant’s terms and return policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">3. Price & Availability Accuracy</h2>
          <p>
            While we audit prices and availability regularly, merchants may modify prices, shipping policies, or stock status at any time without notice. Visitors must confirm current pricing on the merchant&apos;s checkout page prior to purchase.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">4. Owned Digital Products & Refund Policy</h2>
          <p>
            Purchases of EveryAge Digital publications (PDF guides and Notion templates) include our 30-day money-back guarantee. If you are unsatisfied with an in-house guide, email support@everyagedigital.com within 30 days of purchase for a complete refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-neutral-900">5. Limitation of Liability</h2>
          <p>
            EveryAge Digital is not liable for merchant fulfillment delays, defective third-party hardware, or discrepancies on external platforms.
          </p>
        </section>
      </div>
    </div>
  );
}
