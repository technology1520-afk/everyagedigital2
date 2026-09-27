'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Key, 
  Save, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  Sparkles,
  Flame,
  ExternalLink,
  Loader2,
  Bot
} from 'lucide-react';
export default function AdminSettingsPage() {
  const router = useRouter();
  const [isHalloween, setIsHalloween] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  // On load: Fetch the live status directly from /api/theme
  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/theme', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setIsHalloween(Boolean(data.active));
        }
      } catch (err) {
        console.error('Failed to fetch theme from /api/theme:', err);
      }
    }
    loadTheme();
  }, []);

  // On toggle: POST to /api/theme, update local state, and call router.refresh()
  const handleToggle = async () => {
    const nextState = !isHalloween;
    setIsHalloween(nextState);
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: nextState, theme: 'halloween' })
        });
        const data = await res.json();
        if (data.success) {
          setFeedback(
            nextState
              ? 'Spooky Halloween mode active! Live Supabase updated and storefront cache revalidated.'
              : 'Halloween mode disabled. Standard glass theme active.'
          );
        } else {
          setIsHalloween(!nextState);
          setFeedback('Failed to update seasonal theme.');
        }

        // Trigger a server revalidation call
        router.refresh();
      } catch (err: unknown) {
        console.error('Failed to update theme:', err);
        setIsHalloween(!nextState);
        setFeedback(err instanceof Error ? err.message : 'Error updating theme');
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          System &amp; Campaign Configuration
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Configure seasonal campaigns, affiliate tracking IDs, price freshness timers, and payment credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Seasonal Campaign Control Card */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Seasonal Campaign Control
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Instant skinning &amp; atmosphere toggle for storefront visitors.
                </p>
              </div>
            </div>

            {/* Live Preview Button */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 transition-colors"
            >
              <span>Preview Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </Link>
          </div>

          {/* Main Switch & Status Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/70">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  Spooky Halloween Mode (Storefront)
                </span>
                {isHalloween ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/15 text-orange-700 border border-orange-300">
                    <Flame className="w-3 h-3 text-orange-600 animate-pulse" />
                    Active (Orange Ember Theme)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-200 text-neutral-600">
                    <Sparkles className="w-3 h-3 text-neutral-400" />
                    Standard Glass Theme
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                Flips storefront buttons, badges, and filters to vibrant pumpkin orange, surrounds cards with warm amber drop shadows, renders corner web accents, and activates the smoky purple-black canvas.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 shrink-0">
              {isPending && <Loader2 className="w-4 h-4 animate-spin text-orange-600" />}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHalloween}
                  disabled={isPending}
                  onChange={handleToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>

          {/* Dynamic Feedback Alert */}
          {feedback && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Hermes AI Agent Info */}
          <div className="flex items-start gap-2.5 text-[11px] text-neutral-600 bg-white p-3 rounded-lg border border-neutral-200/60">
            <Bot className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-800">Hermes AI Agent Support: </span>
              The AI agent can query and toggle this campaign anytime via MCP tools{' '}
              <code className="px-1.5 py-0.5 rounded bg-neutral-100 text-purple-700 font-mono text-[10px]">
                get_seasonal_theme
              </code>{' '}
              and{' '}
              <code className="px-1.5 py-0.5 rounded bg-neutral-100 text-purple-700 font-mono text-[10px]">
                set_seasonal_theme({'{ active: true, theme: "halloween" }'})
              </code>
              .
            </div>
          </div>
        </div>

        {/* Card 1: Affiliate Network IDs & Tags */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Key className="w-4 h-4 text-[#234F9E]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Affiliate Tracking Tags &amp; Partner Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Amazon Associates Tracking Tag
              </label>
              <input
                type="text"
                defaultValue="everyagedigital-20"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
              <p className="text-[10px] text-neutral-500">
                Appended automatically to Amazon product outbound links.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Gumroad Affiliate ID
              </label>
              <input
                type="text"
                defaultValue="everyagedigital"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
              <p className="text-[10px] text-neutral-500">
                Tracking parameter for digital creator templates.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Impact Radius Media Partner ID
              </label>
              <input
                type="text"
                defaultValue="IR-EVERYAGE-8921"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                ClickBank HopLink Account
              </label>
              <input
                type="text"
                defaultValue="everyagedig"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Price Freshness & Compliance Rules */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Clock className="w-4 h-4 text-[#234F9E]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Price Freshness &amp; Policy Timers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Price Stale Threshold (Days)
              </label>
              <input
                type="number"
                defaultValue="7"
                min="1"
                max="30"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] text-neutral-900"
              />
              <p className="text-[10px] text-neutral-500">
                After this threshold, storefront replaces static prices with &quot;Check current price at merchant&quot;.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Default Outbound Rel Tag
              </label>
              <input
                type="text"
                disabled
                defaultValue="sponsored nofollow noopener"
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-emerald-700 font-medium">
                Locked to strict Google/FTC affiliate requirement.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-neutral-700">
              Mandatory Amazon Associate Statement
            </label>
            <input
              type="text"
              readOnly
              value="As an Amazon Associate I earn from qualifying purchases."
              className="w-full px-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-700 font-mono"
            />
            <p className="text-[10px] text-neutral-500">
              Rendered on all product pages containing Amazon offers.
            </p>
          </div>
        </div>

        {/* Card 3: Payments & Merchant-of-Record */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <CreditCard className="w-4 h-4 text-[#234F9E]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Digital Product Payment Gateways
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Lemon Squeezy API Key
              </label>
              <input
                type="password"
                placeholder="ls_test_••••••••••••••••"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Paddle Vendor ID
              </label>
              <input
                type="text"
                placeholder="vendor_••••••••"
                className="w-full px-3 py-2 text-xs font-mono bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E]"
              />
            </div>
          </div>
        </div>

        {/* Save Confirmation */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings synchronized to environment and runtime repository</span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
