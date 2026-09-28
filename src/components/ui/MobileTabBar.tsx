'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Compass, BookOpen, Flame, SlidersHorizontal } from 'lucide-react';

export function MobileTabBar() {
  const pathname = usePathname();

  // Hide mobile tab bar on admin routes to prevent overlapping owner tools
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const tabs = [
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Collections', href: '/collections', icon: Compass },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Deals', href: '/deals', icon: Flame },
    { name: 'Concierge', href: '/assistant', icon: SlidersHorizontal },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong px-2 py-1 flex items-center justify-around pb-safe transition-colors"
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
                ? 'text-neutral-950 dark:text-white font-bold'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <tab.icon
              className={`w-4 h-4 ${
                isActive
                  ? 'text-neutral-950 dark:text-white'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            />
            <span className="text-[10px] font-mono uppercase tracking-wider mt-1">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
