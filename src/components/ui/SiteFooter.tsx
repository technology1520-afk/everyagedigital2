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
    <footer className="border-t border-purple-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Mobile Accordion Navigation (Phones only, md:hidden) */}
        <div className="md:hidden divide-y divide-purple-200/40 dark:divide-white/10 border-y border-purple-200/40 dark:border-white/10">
          {FOOTER_SECTIONS.map(section => {
            const isOpen = Boolean(openSections[section.title]);
            return (
              <div key={section.title} className="py-1">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  aria-expanded={isOpen}
                  className="touch-target w-full flex items-center justify-between py-3.5 px-1 text-sm font-semibold text-slate-900 dark:text-white min-h-[48px] text-left"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
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
                          className="touch-target min-h-[44px] flex items-center text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                        {link.note && (
                          <p className="text-[11px] text-slate-500 pb-2 leading-relaxed">
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
              <h5 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-900 dark:text-white mb-3">{section.title}</h5>
              <ul className="space-y-2 text-xs">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white transition-colors">
                      {link.label}
                    </Link>
                    {link.note && (
                      <span className="text-[11px] text-slate-500 block mt-2">
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
        <div className="border-t border-purple-200/40 dark:border-white/10 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EveryAge Digital. All rights reserved. Made for thoughtful, distraction-free discovery.</p>
          <p className="text-xs text-slate-500 mt-4 max-w-xl mx-auto text-center leading-relaxed">
            EveryAge Digital independently curates and reviews products. As an Amazon Associate, we earn from qualifying purchases through merchant links at no additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}

