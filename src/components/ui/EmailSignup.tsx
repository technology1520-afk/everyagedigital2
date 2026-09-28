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
    <div className="rounded-2xl glass-strong p-8 sm:p-10">
      <div className="max-w-2xl">
        <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-semibold glass-pill px-2.5 py-1 rounded-full mb-2">
          Curated Knowledge • EveryAge Dispatch
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
          Thoughtful recommendations, delivered every Thursday.
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
          Five vetted physical essentials, one high-leverage digital resource, and zero advertising fluff. Unsubscribe at any time.
        </p>

        {submitted ? (
          <div className="mt-5 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Thank you for subscribing! We have sent a confirmation email to {email}.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-3 py-2.5 text-xs font-mono glass rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-500 dark:focus:border-white/40 transition-colors min-h-[40px]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white text-xs font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0 min-h-[40px] font-semibold"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-3">
          We respect your inbox. No sponsored spam or shared data.
        </p>
      </div>
    </div>
  );
}
