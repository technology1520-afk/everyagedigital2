'use client';

import React, { useState, useEffect } from 'react';
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
  Flame,
  Info,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { MobileSearchToggle } from './MobileSearchToggle';

export function SiteHeader() {
  const pathname = usePathname();
  const { savedProductIds, savedBookIds, compareProductIds } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on navigation or escape
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <header className="sticky top-0 z-40 w-full bg-[#F7F7F4]/90 backdrop-blur-md border-b border-[#E4E7EC]">
      {/* Top micro announcement / transparency notice */}
      <div className="bg-[#151515] text-white py-1 px-4 text-center text-[11px] font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="truncate">Independent editorial commerce. Direct merchant links. Zero sponsored bias.</span>
        <Link href="/methodology" className="underline text-neutral-300 hover:text-white text-[10px] shrink-0">
          Methodology &rarr;
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 relative">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-baseline gap-2 group touch-target">
            <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-[#234F9E] transition-colors">
              EveryAge
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#234F9E] font-semibold bg-[#234F9E]/10 px-1.5 py-0.5 rounded">
              Digital
            </span>
          </Link>

          {/* Desktop Navigation Links (inline on md+) */}
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

        {/* Right Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Toggle (phone only) */}
          <MobileSearchToggle />

          {/* Desktop Search Trigger (hidden on mobile phone) */}
          <Link
            href="/search"
            aria-label="Search catalog"
            className="hidden md:flex p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-full transition-colors items-center gap-1.5 text-xs font-medium touch-target"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-neutral-500">Search</span>
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label={mounted && totalSaved > 0 ? `Saved items (${totalSaved})` : 'Saved items'}
            className="touch-target relative p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-full transition-colors"
          >
            <Bookmark className="w-5 h-5 md:w-4 md:h-4" />
            {mounted && totalSaved > 0 && (
              <span className="absolute top-1.5 right-1.5 md:top-0.5 md:right-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalSaved}
              </span>
            )}
          </Link>

          {/* Compare Drawer Link */}
          <Link
            href="/compare"
            aria-label={mounted && totalCompare > 0 ? `Compare products (${totalCompare})` : 'Compare products'}
            className="touch-target relative p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-full transition-colors"
          >
            <Scale className="w-5 h-5 md:w-4 md:h-4" />
            {mounted && totalCompare > 0 && (
              <span className="absolute top-1.5 right-1.5 md:top-0.5 md:right-0.5 bg-[#234F9E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalCompare}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger Menu Button (phone only) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle secondary navigation"
            aria-expanded={mobileMenuOpen}
            className="touch-target md:hidden p-2.5 text-neutral-700 hover:bg-neutral-200/60 rounded-lg cursor-pointer transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Slide-Down Menu with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[88px] bg-black/40 backdrop-blur-xs z-30 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#E4E7EC] p-5 space-y-4 shadow-xl z-40 max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
            {/* Primary Destinations in drawer */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold px-3 block mb-1">
                Explore Catalog
              </span>
              {navLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`touch-target w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#234F9E] text-white font-semibold'
                        : link.highlight
                        ? 'bg-[#EFEDFB] text-[#6D5BD0] border border-[#D9D2F5]'
                        : 'text-neutral-800 hover:bg-[#F7F7F4]'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Secondary Editorial & Info Links */}
            <div className="pt-3 border-t border-neutral-100 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold px-3 block mb-1">
                Editorial & Standards
              </span>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-[#F7F7F4]"
              >
                <Info className="w-4 h-4 text-neutral-400" />
                <span>About EveryAge Digital</span>
              </Link>
              <Link
                href="/methodology"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-[#F7F7F4]"
              >
                <ShieldCheck className="w-4 h-4 text-neutral-400" />
                <span>Vetting Methodology & Testing</span>
              </Link>
              <Link
                href="/affiliate-disclosure"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-[#F7F7F4]"
              >
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Full Affiliate Disclosure</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:bg-[#F7F7F4]"
              >
                <span className="w-2 h-2 rounded-full bg-[#234F9E]" />
                <span>Owner Control Center</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
