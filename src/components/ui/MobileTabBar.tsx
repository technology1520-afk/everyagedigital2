'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Compass, BookOpen, Flame, Sparkles } from 'lucide-react';

export function MobileTabBar() {
  const pathname = usePathname();

  // Hide mobile tab bar on admin routes to prevent overlapping owner tools
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const tabs = [
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Collections', href: '/collection/home-office-starter-kit', icon: Compass },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Deals', href: '/deals', icon: Flame },
    { name: 'Assistant', href: '/assistant', icon: Sparkles, highlight: true },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-slate-950/80 border-t border-white/10 px-2 py-1 flex items-center justify-around shadow-2xl pb-safe transition-all"
    >
      {tabs.map(tab => {
        const isActive =
          pathname === tab.href ||
          (tab.href !== '/' && pathname.startsWith(tab.href));

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`touch-target flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[44px] min-h-[44px] rounded-lg ${
              isActive
                ? 'text-blue-400 font-semibold'
                : tab.highlight
                ? 'text-purple-400 hover:text-purple-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon
              className={`w-5 h-5 ${
                isActive
                  ? 'text-blue-400'
                  : tab.highlight
                  ? 'text-purple-400'
                  : 'text-slate-400'
              }`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
