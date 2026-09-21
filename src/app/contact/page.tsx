'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'correction',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          Editorial Inquiries
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Get in Touch with Our Editorial Desk
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          Report a stale price, suggest a product for independent testing, or request support for an in-house digital guide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Channels */}
        <div className="md:col-span-5 bg-white border border-[#E2E5EB] rounded-2xl p-6 space-y-6 shadow-xs text-xs text-neutral-700">
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              Direct Contact Channels
            </h3>
            <p className="text-neutral-500 mt-1 leading-relaxed">
              We respond to editorial corrections and reader inquiries within 1 business day.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-[#F7F7F4] rounded-xl border border-neutral-200/60">
              <span className="font-semibold text-neutral-900 block mb-0.5">Editorial & Stale Price Reports:</span>
              <a href="mailto:editorial@everyagedigital.com" className="text-[#1D438A] hover:underline font-mono">
                editorial@everyagedigital.com
              </a>
            </div>

            <div className="p-3 bg-[#F7F7F4] rounded-xl border border-neutral-200/60">
              <span className="font-semibold text-neutral-900 block mb-0.5">Customer Support (Digital Guides):</span>
              <a href="mailto:support@everyagedigital.com" className="text-[#1D438A] hover:underline font-mono">
                support@everyagedigital.com
              </a>
            </div>

            <div className="p-3 bg-[#F7F7F4] rounded-xl border border-neutral-200/60">
              <span className="font-semibold text-neutral-900 block mb-0.5">Brand & Affiliate Partnerships:</span>
              <a href="mailto:partners@everyagedigital.com" className="text-[#1D438A] hover:underline font-mono">
                partners@everyagedigital.com
              </a>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Notice to PR agencies:</strong> We do not accept paid reviews or offer guaranteed positive ratings. All hardware must undergo unbiased editorial evaluation.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white border border-[#E2E5EB] rounded-2xl p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">Message Received</h2>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, {formData.name}. Our editorial team will review your note and respond to <strong className="text-neutral-800">{formData.email}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', topic: 'correction', message: '' });
                }}
                className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-neutral-700 mb-1">
                  Your Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#1D438A]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#1D438A]"
                />
              </div>

              <div>
                <label htmlFor="topic" className="block text-xs font-medium text-neutral-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  id="topic"
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#1D438A] bg-white cursor-pointer"
                >
                  <option value="correction">Report a Stale Price or Outdated Offer</option>
                  <option value="suggestion">Suggest a Product or Book for Review</option>
                  <option value="support">Support for an Owned Digital Product</option>
                  <option value="partnership">Affiliate Network or Partnership Inquiry</option>
                  <option value="other">General Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-neutral-700 mb-1">
                  Message Details
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide details, URLs, or specific product context..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-[#1D438A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#1D438A] hover:bg-[#153266] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Dispatch...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Editorial Desk</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
