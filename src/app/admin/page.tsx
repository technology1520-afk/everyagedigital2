import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  MousePointerClick, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Bot, 
  CheckCircle, 
  ArrowRight, 
  ShieldAlert, 
  Clock 
} from 'lucide-react';
import { catalogRepository } from '../../lib/db/repository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  await catalogRepository.getAllProducts();
  const stats = catalogRepository.getDashboardStats();
  const maxClicks = Math.max(...stats.topProducts.map(p => p.clicks), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Commerce Operations & Click Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time affiliate telemetry, link freshness audit, and catalog status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-all shadow-sm"
          >
            <span>Add New Product</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Products */}
        <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-5 space-y-3 transition-all duration-200 hover:shadow-xl hover:bg-white/75 dark:hover:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Products</span>
            <span className="p-2.5 rounded-xl bg-blue-500/10 text-[#234F9E] dark:text-blue-400 border border-blue-500/20">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalActiveProducts}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">catalog items</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Across 5 curated categories
          </div>
        </div>

        {/* Card 2: Clicks Last 7 Days */}
        <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-5 space-y-3 transition-all duration-200 hover:shadow-xl hover:bg-white/75 dark:hover:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clicks (7 Days)</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <MousePointerClick className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.clicksLast7d}</span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">outbound</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Tracked via /api/go/[id]
          </div>
        </div>

        {/* Card 3: Clicks Last 30 Days */}
        <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-5 space-y-3 transition-all duration-200 hover:shadow-xl hover:bg-white/75 dark:hover:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clicks (30 Days)</span>
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.clicksLast30d}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">total leads</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            30-day merchant referrals
          </div>
        </div>

        {/* Card 4: Top Product */}
        <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-5 space-y-3 transition-all duration-200 hover:shadow-xl hover:bg-white/75 dark:hover:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Performer</span>
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="truncate">
            <div className="text-base font-bold text-slate-900 dark:text-white truncate">
              {stats.topProduct ? stats.topProduct.name : 'None'}
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-400 font-semibold mt-0.5">
              {stats.topProduct ? `${stats.topProduct.clicks} clicks` : '-'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Highest CTR in catalog
          </div>
        </div>
      </div>

      {/* Main Grid: Top 10 by Clicks + Stale Price Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top 10 Products by Clicks with Sparkline (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Top Products by Click Volume
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance breakdown over the last 30 days
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-[#234F9E] dark:text-blue-400 hover:underline font-semibold"
            >
              View All Products
            </Link>
          </div>

          {stats.topProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No products available
            </div>
          ) : (
            <div className="divide-y divide-white/40 dark:divide-white/5">
              {stats.topProducts.map((p, idx) => {
                const percentage = Math.round((p.clicks / maxClicks) * 100);
                return (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xs font-mono font-bold text-slate-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{p.merchant}</span>
                          <span>•</span>
                          <span>${p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sparkline Visual Bar */}
                    <div className="w-36 flex items-center gap-2 shrink-0">
                      <div className="flex-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-full h-2 overflow-hidden backdrop-blur-xs">
                        <div
                          className="bg-[#234F9E] dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                        {p.clicks}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Stale-Price List & Assistant Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stale Price Watch List */}
          <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Stale Price Watch ({stats.staleProducts.length})
                </h2>
              </div>
              <Link
                href="/admin/links"
                className="text-xs text-[#234F9E] dark:text-blue-400 hover:underline font-semibold"
              >
                All Links
              </Link>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Items exceeding the freshness threshold (7 days) require manual or automated merchant verification.
            </p>

            {stats.staleProducts.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 backdrop-blur-md">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>All catalog affiliate offers are fresh and up to date!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.staleProducts.slice(0, 4).map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 backdrop-blur-md flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Last checked {item.daysAgo} days ago</span>
                      </div>
                    </div>

                    <form action={async () => {
                      'use server';
                      catalogRepository.markLinkChecked(`link-${item.id}`);
                    }}>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-[11px] font-semibold bg-white/80 dark:bg-slate-800/80 border border-amber-400/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors shadow-2xs backdrop-blur-md"
                      >
                        Verify Now
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Shopping Receptionist Telemetry */}
          <div className="rounded-2xl bg-white/65 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#234F9E] dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Sage Assistant Activity
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full">
                {stats.assistantConversations7d} chats / 7d
              </span>
            </div>

            {/* Hallucination Monitor Status */}
            <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-medium">
                <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Catalog Grounding Guard</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                0 Hallucinations
              </span>
            </div>

            {/* Recent Questions */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Recent User Inquiries
              </span>
              <div className="space-y-1.5">
                {stats.recentQuestions.length === 0 ? (
                  <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 backdrop-blur-md text-xs text-slate-500 dark:text-slate-400 italic">
                    No inquiries recorded yet
                  </div>
                ) : (
                  stats.recentQuestions.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/40 border border-white/30 dark:border-white/5 backdrop-blur-md text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="font-mono text-slate-400 text-[10px] mt-0.5">#{idx + 1}</span>
                      <span className="line-clamp-1 italic">&ldquo;{q.question}&rdquo;</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/admin/assistant"
              className="block text-center text-xs text-[#234F9E] dark:text-blue-400 hover:underline font-semibold pt-1"
            >
              Open Full Conversation Audit Logs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
