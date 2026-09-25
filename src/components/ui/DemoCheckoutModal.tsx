'use client';

import React, { useState } from 'react';
import { OwnedProduct } from '../../types';
import { X, ShieldCheck, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DemoCheckoutModalProps {
  product: OwnedProduct;
  isOpen: boolean;
  onClose: () => void;
}

export function DemoCheckoutModal({ product, isOpen, onClose }: DemoCheckoutModalProps) {
  const [email, setEmail] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCompleted(true);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10 relative overflow-hidden animate-in fade-in duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Disclaimer Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 mb-5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="text-amber-100">DEMO CHECKOUT MODE</strong>
            <p className="mt-0.5 text-[11px] text-amber-200/90">
              Not connected to a real payment provider. No credit card is needed and no actual charge will occur.
            </p>
          </div>
        </div>

        {!completed ? (
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Owned Digital Product
            </span>
            <h2 id="modal-title" className="text-lg font-bold text-white mt-1">
              {product.title}
            </h2>
            <div className="mt-2 text-2xl font-bold text-white">
              ${product.price.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-400 uppercase">{product.currency}</span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Format: <span className="font-medium text-white">{product.fileFormat}</span> ({product.pageCountOrModules})
            </p>

            <form onSubmit={handleSimulatePayment} className="mt-6 space-y-4">
              <div>
                <label htmlFor="customer-email" className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Email for Delivery
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-sm bg-slate-950/60 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-white/[0.04] rounded-xl text-[11px] text-slate-400 space-y-1 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <p>Digital files are delivered immediately after checkout confirmation.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Generating Demo Order...</span>
                ) : (
                  <span>Simulate Instant Purchase (${product.price.toFixed(2)})</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Demo Purchase Successful!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Order confirmation simulated for <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div className="p-4 bg-white/[0.04] border border-white/10 rounded-xl text-left text-xs space-y-2">
              <span className="font-semibold text-slate-200 block">Simulated Deliverables:</span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {product.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Download className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
