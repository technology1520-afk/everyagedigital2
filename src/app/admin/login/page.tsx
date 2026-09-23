'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginAdminAction } from '../../actions/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAdminAction(formData);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setError('An unexpected error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F5F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#234F9E]/10 text-[#234F9E] mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-neutral-950 tracking-tight">
            Owner Control Center
          </h1>
          <p className="text-xs text-neutral-500">
            Sign in to manage products, affiliate links, and real-time commerce stats.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                name="email"
                required
                defaultValue={process.env.NODE_ENV === 'production' ? '' : 'admin@everyagedigital.com'}
                placeholder="admin@everyagedigital.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] focus:bg-white text-neutral-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                name="password"
                required
                defaultValue={process.env.NODE_ENV === 'production' ? '' : 'admin12345'}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F7F7F4] border border-neutral-200 rounded-lg focus:outline-none focus:border-[#234F9E] focus:bg-white text-neutral-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#234F9E] text-white hover:bg-[#193B7A] disabled:opacity-50 transition-colors shadow-sm mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Control Center'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Development Credential Helper */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[11px] text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Owner Pre-Configured Access</span>
            </div>
            <p>
              Default: <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-900 font-mono">admin@everyagedigital.com</code> / <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-900 font-mono">admin12345</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
