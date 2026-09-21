'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export function EmailSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[#F0F1ED] border border-[#E2E5EB] rounded-2xl p-6 sm:p-8">
      <div className="max-w-xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          EveryAge Dispatch
        </span>
        <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-1">
          Thoughtful recommendations, delivered every Thursday.
        </h3>
        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
          Five vetted physical essentials, one high-leverage digital resource, and zero advertising fluff. Unsubscribe at any time.
        </p>

        {submitted ? (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you for subscribing! We have sent a confirmation email to {email}.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E2E5EB] rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:border-[#1D438A] focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 bg-[#1D438A] text-white text-xs font-semibold rounded-lg hover:bg-[#153266] transition-colors cursor-pointer shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[10px] text-neutral-400 mt-2">
          We respect your inbox. No sponsored spam or shared data.
        </p>
      </div>
    </div>
  );
}
