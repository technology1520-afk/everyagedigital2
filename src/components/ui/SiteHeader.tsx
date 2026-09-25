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
import { ThemeToggle } from './ThemeToggle';

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
    { name: 'AI Assistant', href: '/assistant', icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/70 border-b border-white/10 shadow-lg shadow-black/20 transition-all">
      {/* Top micro announcement / transparency notice */}
      <div className="bg-slate-950/80 backdrop-blur-md text-slate-300 border-b border-white/10 py-1 px-4 text-center text-[11px] font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="truncate">Independent editorial commerce. Direct merchant links. Zero sponsored bias.</span>
        <Link href="/methodology" className="underline text-blue-400 hover:text-blue-300 text-[10px] shrink-0">
          Methodology &rarr;
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 relative">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-baseline gap-2 group touch-target">
            <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              EveryAge
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg backdrop-blur-md">
              Digital
            </span>
          </Link>

          {/* Desktop Navigation Links (inline on md+) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20 shadow-xs font-semibold'
                      : link.highlight
                      ? 'bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200'
                      : 'text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <link.icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : link.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Search Toggle (phone only) */}
          <MobileSearchToggle />

          {/* Desktop Search Trigger (hidden on mobile phone) */}
          <Link
            href="/search"
            aria-label="Search catalog"
            className="hidden md:flex p-2 px-3 text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 focus:border-blue-400/50 backdrop-blur-md rounded-xl transition-all items-center gap-1.5 text-xs font-medium touch-target min-h-[40px]"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline text-slate-300">Search</span>
          </Link>

          {/* Light / Dark Theme Toggle */}
          <div className="bg-white/5 border border-white/10 hover:bg-white/10 focus-within:border-blue-400/50 backdrop-blur-md rounded-xl transition-all flex items-center justify-center min-h-[40px] min-w-[40px]">
            <ThemeToggle />
          </div>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label={mounted && totalSaved > 0 ? `Saved items (${totalSaved})` : 'Saved items'}
            className="touch-target relative p-2.5 text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 focus:border-blue-400/50 backdrop-blur-md rounded-xl transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Bookmark className="w-4 h-4 text-slate-300" />
            {mounted && totalSaved > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {totalSaved}
              </span>
            )}
          </Link>

          {/* Compare Drawer Link */}
          <Link
            href="/compare"
            aria-label={mounted && totalCompare > 0 ? `Compare products (${totalCompare})` : 'Compare products'}
            className="touch-target relative p-2.5 text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 focus:border-blue-400/50 backdrop-blur-md rounded-xl transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Scale className="w-4 h-4 text-slate-300" />
            {mounted && totalCompare > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
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
            className="touch-target md:hidden p-2 text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md rounded-xl cursor-pointer transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Slide-Down Menu with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[88px] bg-black/60 backdrop-blur-sm z-30 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-2xl bg-slate-950/90 border-b border-white/10 p-5 space-y-4 shadow-2xl z-40 max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200 text-slate-100">
            {/* Primary Destinations in drawer */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold px-3 block mb-1">
                Explore Catalog
              </span>
              {navLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`touch-target w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-white border border-blue-500/30 font-semibold shadow-xs'
                        : link.highlight
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : link.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Secondary Editorial & Info Links */}
            <div className="pt-3 border-t border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold px-3 block mb-1">
                Editorial & Standards
              </span>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>About EveryAge Digital</span>
              </Link>
              <Link
                href="/methodology"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Vetting Methodology & Testing</span>
              </Link>
              <Link
                href="/affiliate-disclosure"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Full Affiliate Disclosure</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Owner Control Center</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
