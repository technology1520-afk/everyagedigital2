import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#E2E5EB] bg-white text-neutral-600">
      {/* Editorial Trust & Disclosure Callout */}
      <div className="bg-[#F7F7F4] border-b border-[#E2E5EB] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#1D438A] font-semibold">
              Publishing Standards
            </span>
            <h3 className="text-base font-semibold text-neutral-900 mt-1">
              Curated clearly. Recommended intelligently.
            </h3>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed max-w-xl">
              EveryAge Digital is an independent commerce publication. We research, test, and filter everyday essentials, books, and digital resources. Products are purchased directly on external merchant websites or via authorized digital checkout.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#E2E5EB] text-xs text-neutral-600 leading-relaxed shadow-xs">
            <strong className="font-semibold text-neutral-900 block mb-1">
              Affiliate & Partnership Transparency
            </strong>
            <p className="mb-2">
              <strong>As an Amazon Associate I earn from qualifying purchases.</strong>
            </p>
            <p className="text-[11px] text-neutral-500">
              We also link to Gumroad, Impact, and direct brands. We never accept payment to inflate editorial rankings, nor do we sort recommendations by commission rates.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1 */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-3">
            Marketplace
          </span>
          <ul className="space-y-2 text-xs">
            <li><Link href="/shop" className="hover:text-neutral-900">All Products</Link></li>
            <li><Link href="/books" className="hover:text-neutral-900">Books & Guides</Link></li>
            <li><Link href="/deals" className="hover:text-neutral-900">Verified Deals</Link></li>
            <li><Link href="/collection/home-office-starter-kit" className="hover:text-neutral-900">Curated Collections</Link></li>
            <li><Link href="/shop/own-products" className="hover:text-neutral-900">Our Digital Products</Link></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-3">
            Shopping Tools
          </span>
          <ul className="space-y-2 text-xs">
            <li><Link href="/assistant" className="hover:text-neutral-900 font-medium text-[#1D438A]">AI Shopping Receptionist</Link></li>
            <li><Link href="/compare" className="hover:text-neutral-900">Product Comparison</Link></li>
            <li><Link href="/wishlist" className="hover:text-neutral-900">Saved Wishlist</Link></li>
            <li><Link href="/search" className="hover:text-neutral-900">Global Search</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-3">
            Editorial & Trust
          </span>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="hover:text-neutral-900">About EveryAge Digital</Link></li>
            <li><Link href="/methodology" className="hover:text-neutral-900">Selection Methodology</Link></li>
            <li><Link href="/affiliate-disclosure" className="hover:text-neutral-900">Affiliate Disclosure</Link></li>
            <li><Link href="/contact" className="hover:text-neutral-900">Contact the Editorial Team</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-3">
            Legal & Privacy
          </span>
          <ul className="space-y-2 text-xs">
            <li><Link href="/privacy" className="hover:text-neutral-900">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-neutral-900">Terms of Service</Link></li>
            <li>
              <span className="text-[11px] text-neutral-400 block mt-2">
                Merchant trademarks, logos, and book covers remain the property of their respective owners.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-100 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-neutral-400">
        <p>© {new Date().getFullYear()} EveryAge Digital. All rights reserved. Made for thoughtful, distraction-free discovery.</p>
      </div>
    </footer>
  );
}
