import React from 'react';
import { Metadata } from 'next';
import { ShoppingAssistant } from '../../components/ui/ShoppingAssistant';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { SlidersHorizontal, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catalog Concierge — Grounded Recommendations',
  description: 'Consult our catalog concierge for curated product and guide recommendations tailored to your budget and workspace.'
};

export default function AssistantPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Catalog Concierge' }]} />

      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 text-xs font-mono uppercase tracking-wider border border-neutral-300 dark:border-neutral-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>EveryAge Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-neutral-900 dark:text-white leading-tight">
          Catalog-Grounded Specimen Concierge
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
          Specify your workspace parameters, budget threshold, or setup bottleneck. Our concierge executes deterministic lookups over our vetted catalog and highlights real trade-offs before you purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
        <div className="bg-[#faf9f6] dark:bg-[#0d1117] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-2.5 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span>Restricted strictly to vetted catalog tools</span>
        </div>
        <div className="bg-[#faf9f6] dark:bg-[#0d1117] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span>Explicitly highlights limitations & trade-offs</span>
        </div>
        <div className="bg-[#faf9f6] dark:bg-[#0d1117] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-2.5 shadow-xs">
          <Lock className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span>Privacy-preserving (zero ad trackers)</span>
        </div>
      </div>

      {/* Main Interactive Assistant */}
      <ShoppingAssistant />
    </div>
  );
}
