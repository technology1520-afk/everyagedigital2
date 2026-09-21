import React from 'react';
import { Metadata } from 'next';
import { ShoppingAssistant } from '../../components/ui/ShoppingAssistant';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AffiliateDisclosure } from '../../components/ui/AffiliateDisclosure';
import { Sparkles, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Shopping Receptionist — Grounded Recommendations',
  description: 'Ask our polite shopping receptionist for curated product and guide recommendations tailored to your budget and workspace.'
};

export default function AssistantPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'AI Shopping Receptionist' }]} />

      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D438A]/10 text-[#1D438A] text-xs font-semibold border border-[#1D438A]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EveryAge Assistant</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Polite, Catalog-Grounded Product Concierge
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          Tell us your budget, the problem you want to solve, or the gear you need. Our shopping assistant never hallucinates unvetted products or ranks by affiliate commission.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600">
        <div className="bg-white p-3.5 rounded-xl border border-[#E2E5EB] flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Restricted strictly to vetted catalog tools</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E2E5EB] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Explicitly highlights limitations & trade-offs</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E2E5EB] flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-neutral-500 shrink-0" />
          <span>Privacy-preserving (no personal data logged)</span>
        </div>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      {/* Main Interactive Assistant */}
      <ShoppingAssistant />
    </div>
  );
}
