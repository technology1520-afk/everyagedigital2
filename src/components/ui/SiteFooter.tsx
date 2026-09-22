'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface FooterSection {
  title: string;
  links: { label: string; href: string; note?: string }[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Marketplace',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'Books & Guides', href: '/books' },
      { label: 'Verified Deals', href: '/deals' },
      { label: 'Curated Collections', href: '/collection/home-office-starter-kit' },
      { label: 'Our Digital Products', href: '/shop/own-products' },
    ]
  },
  {
    title: 'Shopping Tools',
    links: [
      { label: 'AI Shopping Receptionist', href: '/assistant' },
      { label: 'Product Comparison', href: '/compare' },
      { label: 'Saved Wishlist', href: '/wishlist' },
      { label: 'Global Search', href: '/search' },
    ]
  },
  {
    title: 'Editorial & Trust',
    links: [
      { label: 'About EveryAge Digital', href: '/about' },
      { label: 'Selection Methodology', href: '/methodology' },
      { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
      { label: 'Contact the Editorial Team', href: '/contact' },
    ]
  },
  {
    title: 'Legal & Privacy',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Trademarks & Copyright Notice', href: '/terms', note: 'Merchant trademarks, logos, and book covers remain the property of their respective owners.' },
    ]
  }
];

export function SiteFooter() {
  // Mobile accordion open states (default: first section open)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Marketplace: true,
  });

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <footer className="site-footer">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Top Transparency & Editorial Trust Section */}
        <div className="p-5 sm:p-6 rounded-2xl border border-neutral-800 bg-neutral-900/70 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-center">
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
          <div className="p-4 rounded-xl border border-neutral-800 bg-black/40 text-xs text-[#B9BFC9] leading-relaxed">
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

        {/* Mobile Accordion Navigation (Phones only, md:hidden) */}
        <div className="md:hidden divide-y divide-neutral-800 border-y border-neutral-800">
          {FOOTER_SECTIONS.map(section => {
            const isOpen = Boolean(openSections[section.title]);
            return (
              <div key={section.title} className="py-1">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  aria-expanded={isOpen}
                  className="touch-target w-full flex items-center justify-between py-3.5 px-1 text-sm font-semibold text-white min-h-[48px] text-left"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8FA8D6] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <ul className="pb-3 pl-1 space-y-0 text-sm">
                    {section.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="touch-target min-h-[44px] flex items-center text-[#B9BFC9] hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                        {link.note && (
                          <p className="text-[11px] text-neutral-500 pb-2 leading-relaxed">
                            {link.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Tablet & Desktop Multi-column Grid (hidden md:grid) */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <h5>{section.title}</h5>
              <ul className="space-y-2 text-xs">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                    {link.note && (
                      <span className="text-[11px] text-neutral-500 block mt-2">
                        {link.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800/80 pt-6 text-center text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} EveryAge Digital. All rights reserved. Made for thoughtful, distraction-free discovery.</p>
        </div>
      </div>
    </footer>
  );
}

