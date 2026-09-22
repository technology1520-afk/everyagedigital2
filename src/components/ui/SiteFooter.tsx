import React from 'react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Transparency & Editorial Trust Section */}
        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/70 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8FA8D6] font-semibold">
              Publishing Standards
            </span>
            <h4 className="text-base font-semibold text-white mt-1">
              Curated clearly. Recommended intelligently.
            </h4>
            <p className="text-xs text-[#B9BFC9] mt-1.5 leading-relaxed">
              EveryAge Digital is an independent commerce publication. We research, test, and filter everyday essentials, books, and digital resources. Products are purchased directly on external merchant websites or via authorized digital checkout.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-neutral-800 bg-black/40 text-xs text-[#B9BFC9] leading-relaxed">
            <strong className="font-semibold text-white block mb-1">
              Affiliate & Partnership Transparency
            </strong>
            <p className="mb-2 text-white">
              <strong>As an Amazon Associate I earn from qualifying purchases.</strong>
            </p>
            <p className="text-[11px] text-neutral-400">
              We also link to Gumroad, Impact, and direct brands. We never accept payment to inflate editorial rankings, nor do we sort recommendations by commission rates.
            </p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div>
            <h5>Marketplace</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/books">Books & Guides</Link></li>
              <li><Link href="/deals">Verified Deals</Link></li>
              <li><Link href="/collection/home-office-starter-kit">Curated Collections</Link></li>
              <li><Link href="/shop/own-products">Our Digital Products</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h5>Shopping Tools</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/assistant">AI Shopping Receptionist</Link></li>
              <li><Link href="/compare">Product Comparison</Link></li>
              <li><Link href="/wishlist">Saved Wishlist</Link></li>
              <li><Link href="/search">Global Search</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5>Editorial & Trust</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about">About EveryAge Digital</Link></li>
              <li><Link href="/methodology">Selection Methodology</Link></li>
              <li><Link href="/affiliate-disclosure">Affiliate Disclosure</Link></li>
              <li><Link href="/contact">Contact the Editorial Team</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5>Legal & Privacy</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li>
                <span className="text-[11px] text-neutral-500 block mt-2">
                  Merchant trademarks, logos, and book covers remain the property of their respective owners.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800/80 pt-6 text-center text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} EveryAge Digital. All rights reserved. Made for thoughtful, distraction-free discovery.</p>
        </div>
      </div>
    </footer>
  );
}
