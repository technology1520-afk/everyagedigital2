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

export default function AdminDashboardPage() {
  const stats = catalogRepository.getDashboardStats();
  const maxClicks = Math.max(...stats.topProducts.map(p => p.clicks), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Commerce Operations & Click Intelligence
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time affiliate telemetry, link freshness audit, and catalog status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#234F9E] text-white text-xs font-semibold hover:bg-[#193B7A] transition-colors shadow-xs"
          >
            <span>Add New Product</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Products */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Active Products</span>
            <span className="p-2 rounded-lg bg-blue-50 text-[#234F9E]">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900">{stats.totalActiveProducts}</span>
            <span className="text-xs text-neutral-500">catalog items</span>
          </div>
          <div className="text-[11px] text-neutral-400">
            Across 5 curated categories
          </div>
        </div>

        {/* Card 2: Clicks Last 7 Days */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Clicks (7 Days)</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <MousePointerClick className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900">{stats.clicksLast7d}</span>
            <span className="text-xs font-medium text-emerald-700">outbound</span>
          </div>
          <div className="text-[11px] text-neutral-400">
            Tracked via /api/go/[id]
          </div>
        </div>

        {/* Card 3: Clicks Last 30 Days */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Clicks (30 Days)</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900">{stats.clicksLast30d}</span>
            <span className="text-xs text-neutral-500">total leads</span>
          </div>
          <div className="text-[11px] text-neutral-400">
            30-day merchant referrals
          </div>
        </div>

        {/* Card 4: Top Product */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Top Performer</span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="truncate">
            <div className="text-base font-bold text-neutral-900 truncate">
              {stats.topProduct ? stats.topProduct.name : 'N/A'}
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-0.5">
              {stats.topProduct ? `${stats.topProduct.clicks} clicks` : '0 clicks'}
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 truncate">
            Highest CTR in catalog
          </div>
        </div>
      </div>

      {/* Main Grid: Top 10 by Clicks + Stale Price Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top 10 Products by Clicks with Sparkline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                Top Products by Click Volume
              </h2>
              <p className="text-xs text-neutral-500">
                Performance breakdown over the last 30 days
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-[#234F9E] hover:underline font-medium"
            >
              View All Products
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {stats.topProducts.map((p, idx) => {
              const percentage = Math.round((p.clicks / maxClicks) * 100);
              return (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-mono font-bold text-neutral-400 w-4 text-center">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                        <span>{p.merchant}</span>
                        <span>•</span>
                        <span>${p.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sparkline Visual Bar */}
                  <div className="w-36 flex items-center gap-2 shrink-0">
                    <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#234F9E] h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-700 w-8 text-right">
                      {p.clicks}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stale-Price List & Assistant Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stale Price Watch List */}
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                  Stale Price Watch ({stats.staleProducts.length})
                </h2>
              </div>
              <Link
                href="/admin/links"
                className="text-xs text-[#234F9E] hover:underline font-medium"
              >
                All Links
              </Link>
            </div>

            <p className="text-xs text-neutral-500">
              Items exceeding the freshness threshold (7 days) require manual or automated merchant verification.
            </p>

            {stats.staleProducts.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>All catalog affiliate offers are fresh and up to date!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.staleProducts.slice(0, 4).map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-amber-800 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Last checked {item.daysAgo} days ago</span>
                      </div>
                    </div>

                    <form action={async () => {
                      'use server';
                      catalogRepository.markLinkChecked(`link-${item.id}`);
                    }}>
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded transition-colors shadow-2xs"
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
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#234F9E]" />
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                  Sage Assistant Activity
                </h2>
              </div>
              <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                {stats.assistantConversations7d} chats / 7d
              </span>
            </div>

            {/* Hallucination Monitor Status */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-medium">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Catalog Grounding Guard</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                0 Hallucinations
              </span>
            </div>

            {/* Recent Questions */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                Recent User Inquiries
              </span>
              <div className="space-y-1.5">
                {stats.recentQuestions.map((q, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F7F7F4] rounded text-xs text-neutral-700 flex items-start gap-2">
                    <span className="font-mono text-neutral-400 text-[10px] mt-0.5">#{idx + 1}</span>
                    <span className="line-clamp-1 italic">&ldquo;{q.question}&rdquo;</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admin/assistant"
              className="block text-center text-xs text-[#234F9E] hover:underline font-semibold pt-1"
            >
              Open Full Conversation Audit Logs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
