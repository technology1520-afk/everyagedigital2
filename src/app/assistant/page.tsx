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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold border border-blue-500/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EveryAge Assistant</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
          Polite, Catalog-Grounded Product Concierge
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Tell us your budget, the problem you want to solve, or the gear you need. Our shopping assistant never hallucinates unvetted products or ranks by affiliate commission.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
        <div className="bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center gap-2.5 shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Restricted strictly to vetted catalog tools</span>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center gap-2.5 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Explicitly highlights limitations & trade-offs</span>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center gap-2.5 shadow-md">
          <Lock className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Privacy-preserving (no personal data logged)</span>
        </div>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      {/* Main Interactive Assistant */}
      <ShoppingAssistant />
    </div>
  );
}
