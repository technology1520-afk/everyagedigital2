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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 relative overflow-hidden animate-in fade-in duration-200">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Disclaimer Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mb-5 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>DEMO CHECKOUT MODE</strong>
            <p className="mt-0.5 text-[11px] text-amber-800">
              Not connected to a real payment provider. No credit card is needed and no actual charge will occur.
            </p>
          </div>
        </div>

        {!completed ? (
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              Owned Digital Product
            </span>
            <h2 id="modal-title" className="text-lg font-bold text-neutral-900 mt-1">
              {product.title}
            </h2>
            <div className="mt-2 text-2xl font-bold text-neutral-900">
              ${product.price.toFixed(2)}{' '}
              <span className="text-xs font-normal text-neutral-500 uppercase">{product.currency}</span>
            </div>

            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Format: <span className="font-medium text-neutral-900">{product.fileFormat}</span> ({product.pageCountOrModules})
            </p>

            <form onSubmit={handleSimulatePayment} className="mt-6 space-y-4">
              <div>
                <label htmlFor="customer-email" className="block text-xs font-medium text-neutral-700 mb-1">
                  Recipient Email for Delivery
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#1D438A]"
                />
              </div>

              <div className="p-3 bg-[#F7F7F4] rounded-lg text-[11px] text-neutral-500 space-y-1 border border-neutral-200/60">
                <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <p>Digital files are delivered immediately after checkout confirmation.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1D438A] hover:bg-[#153266] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Demo Purchase Successful!
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Order confirmation simulated for <strong className="text-neutral-900">{email}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#F7F7F4] border border-neutral-200 rounded-xl text-left text-xs space-y-2">
              <span className="font-semibold text-neutral-800 block">Simulated Deliverables:</span>
              <ul className="space-y-1.5 text-neutral-600 text-[11px]">
                {product.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#1D438A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
