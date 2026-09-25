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
    <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-xl">
      <div className="max-w-xl">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
          EveryAge Dispatch
        </span>
        <h3 className="font-serif text-2xl font-bold text-white mt-1">
          Thoughtful recommendations, delivered every Thursday.
        </h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Five vetted physical essentials, one high-leverage digital resource, and zero advertising fluff. Unsubscribe at any time.
        </p>

        {submitted ? (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-300 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you for subscribing! We have sent a confirmation email to {email}.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:border-blue-400/50 backdrop-blur-md focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[10px] text-slate-400 mt-2">
          We respect your inbox. No sponsored spam or shared data.
        </p>
      </div>
    </div>
  );
}
