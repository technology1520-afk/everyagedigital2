import React from 'react';
import { 
  Key, 
  Save, 
  CheckCircle2, 
  Clock, 
  CreditCard
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          System & Affiliate Network Configuration
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Configure affiliate program tracking IDs, price freshness timers, and payment credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Card 1: Affiliate Network IDs & Tags */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Key className="w-4 h-4 text-[#234F9E]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Affiliate Tracking Tags & Partner Credentials
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
              Price Freshness & Policy Timers
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
