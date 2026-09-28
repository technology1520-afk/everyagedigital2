'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bookmark, 
  Scale, 
  SlidersHorizontal, 
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
import { ThemeToggle } from './ThemeToggle';

interface SiteHeaderProps {
  isHalloween?: boolean;
}

export function SiteHeader({ isHalloween: propIsHalloween = false }: SiteHeaderProps = {}) {
  const pathname = usePathname();
  const { savedProductIds, savedBookIds, compareProductIds } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHalloween, setIsHalloween] = useState(propIsHalloween);

  useEffect(() => {
    setMounted(true);
    const checkHalloween = () => {
      const isH = typeof document !== 'undefined' && document.documentElement.getAttribute('data-seasonal') === 'halloween';
      setIsHalloween(Boolean(propIsHalloween || isH));
    };
    checkHalloween();
    const observer = new MutationObserver(checkHalloween);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-seasonal'] });
    return () => observer.disconnect();
  }, [propIsHalloween]);

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
    { name: 'Collections', href: '/collections', icon: Compass },
    { name: 'Books & Guides', href: '/books', icon: BookOpen },
    { name: 'Deals', href: '/deals', icon: Flame },
    { name: 'Concierge', href: '/assistant', icon: SlidersHorizontal, isPill: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf9f6]/95 dark:bg-[#0d1117]/95 border-b border-neutral-200/80 dark:border-neutral-800 shadow-xs transition-colors backdrop-blur-md">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3 relative">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="hover:opacity-90 transition-opacity touch-target">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="logo-emblem h-9 w-9 overflow-hidden rounded-lg bg-neutral-900 dark:bg-neutral-100 p-1 shadow-xs flex items-center justify-center shrink-0 border border-neutral-300 dark:border-neutral-800 transition-all">
                <Image alt="EveryAge Digital" className="h-full w-full object-contain invert dark:invert-0" height={32} priority src="/logo.png" width={32}/>
              </div>
              <span className="font-serif font-bold text-lg text-neutral-900 dark:text-white tracking-tight flex items-center">
                EveryAge <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 dark:text-neutral-400 ml-1.5 pt-0.5">Editorial</span>
              </span>
              <span className="hidden [html[data-seasonal=halloween]_&]:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-400/40 shadow-xs">
                🎃 Spooky Edition
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              if (link.isPill) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider transition-all border ${
                      isActive
                        ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 dark:border-white font-semibold'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <link.icon className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs uppercase tracking-wider font-mono transition-colors ${
                    isActive
                      ? 'text-neutral-950 dark:text-white font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Search Toggle (phone only) */}
          <div className="md:hidden">
            <MobileSearchToggle />
          </div>

          {/* Desktop Search Trigger (hidden on mobile phone) */}
          <Link
            href="/search"
            aria-label="Search catalog"
            className="hidden md:flex p-2 px-3 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/80 dark:text-neutral-400 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 rounded-lg transition-colors items-center gap-1.5 text-xs font-mono min-h-[36px]"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
            <span className="font-mono text-xs uppercase tracking-wider">Search</span>
          </Link>

          {/* Light / Dark Theme Toggle or Halloween Pumpkin */}
          <div className="bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 rounded-lg transition-colors flex items-center justify-center min-h-[36px] min-w-[36px]">
            <ThemeToggle isHalloween={isHalloween} />
          </div>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label={mounted && totalSaved > 0 ? `Saved items (${totalSaved})` : 'Saved items'}
            className="touch-target relative p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/80 dark:text-neutral-400 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Bookmark className="w-4 h-4" />
            {mounted && totalSaved > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalSaved}
              </span>
            )}
          </Link>

          {/* Compare Drawer Link */}
          <Link
            href="/compare"
            aria-label={mounted && totalCompare > 0 ? `Compare products (${totalCompare})` : 'Compare products'}
            className="touch-target relative p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/80 dark:text-neutral-400 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Scale className="w-4 h-4" />
            {mounted && totalCompare > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/80 dark:text-neutral-400 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 rounded-lg cursor-pointer transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Slide-Down Menu with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[64px] bg-black/60 z-30 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#faf9f6] dark:bg-[#0d1117] border-b border-neutral-200 dark:border-neutral-800 p-5 space-y-4 shadow-xl z-40 max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200 text-neutral-900 dark:text-neutral-100">
            {/* Primary Destinations in drawer */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold px-3 block mb-1">
                Explore Catalog
              </span>
              {navLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`touch-target w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white font-bold'
                        : link.isPill
                        ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
                        : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    <link.icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Secondary Editorial & Info Links */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold px-3 block mb-1">
                Editorial & Standards
              </span>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <Info className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <span>About EveryAge Digital</span>
              </Link>
              <Link
                href="/methodology"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <ShieldCheck className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <span>Vetting Methodology & Testing</span>
              </Link>
              <Link
                href="/affiliate-disclosure"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <span>Full Affiliate Disclosure</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <span>Owner Control Center</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
