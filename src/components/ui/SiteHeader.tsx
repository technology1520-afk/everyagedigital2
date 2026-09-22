'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bookmark, 
  Scale, 
  Sparkles, 
  Menu, 
  X, 
  BookOpen, 
  ShoppingBag, 
  Compass, 
  Flame 
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export function SiteHeader() {
  const pathname = usePathname();
  const { savedProductIds, savedBookIds, compareProductIds } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalSaved = savedProductIds.length + savedBookIds.length;
  const totalCompare = compareProductIds.length;

  const navLinks = [
    { name: 'Shop All', href: '/shop', icon: ShoppingBag },
    { name: 'Collections', href: '/collection/home-office-starter-kit', icon: Compass },
    { name: 'Books & Guides', href: '/books', icon: BookOpen },
    { name: 'Deals', href: '/deals', icon: Flame },
    { name: 'Our Products', href: '/shop/own-products', icon: ShoppingBag },
    { name: 'AI Assistant', href: '/assistant', icon: Sparkles, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F7F4]/90 backdrop-blur-md border-b border-[#E2E5EB]">
      {/* Top micro announcement / transparency notice */}
      <div className="bg-[#151515] text-white py-1 px-4 text-center text-[11px] font-medium tracking-wide flex items-center justify-center gap-2">
        <span>Independent editorial commerce. Direct merchant links. Zero sponsored bias in ranking.</span>
        <Link href="/methodology" className="underline text-neutral-300 hover:text-white text-[10px]">
          Our Methodology &rarr;
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-baseline gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-[#1D438A] transition-colors">
              EveryAge
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold bg-[#1D438A]/10 px-1.5 py-0.5 rounded">
              Digital
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const classes = [
                'nav-item',
                isActive ? 'active' : '',
                link.highlight ? 'ai-assistant' : ''
              ].filter(Boolean).join(' ');

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={classes}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools: Search, Wishlist, Compare, Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <Link
            href="/search"
            aria-label="Search catalog"
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-neutral-500">Search</span>
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label={`Saved items (${totalSaved})`}
            className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-full transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            {totalSaved > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalSaved}
              </span>
            )}
          </Link>

          {/* Compare Drawer Link */}
          <Link
            href="/compare"
            aria-label={`Compare products (${totalCompare})`}
            className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-full transition-colors"
          >
            <Scale className="w-4 h-4" />
            {totalCompare > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#234F9E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalCompare}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-neutral-700 hover:bg-neutral-200/60 rounded-md cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E5EB] bg-white px-4 py-4 space-y-2 shadow-lg">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const classes = [
              'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
              isActive ? 'active' : '',
              link.highlight ? 'ai-assistant' : ''
            ].filter(Boolean).join(' ');

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={classes}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
              About Us
            </Link>
            <Link href="/methodology" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
              Methodology
            </Link>
            <Link href="/affiliate-disclosure" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
              Disclosure
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
