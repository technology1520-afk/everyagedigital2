'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Link2, 
  Layers, 
  FileBox, 
  Bot, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { logoutAdminAction } from '../../app/actions/admin';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/links', label: 'Affiliate Links', icon: Link2 },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/own-products', label: 'Own Products', icon: FileBox },
  { href: '/admin/assistant', label: 'Assistant Logs', icon: Bot },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden bg-[#151515] text-white border-b border-neutral-800 sticky top-0 z-30">
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#234F9E]" />
          <div>
            <span className="font-bold text-xs tracking-tight uppercase block leading-none">EveryAge Admin</span>
            <span className="text-[10px] font-mono text-neutral-400">Control Center</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close admin navigation' : 'Open admin navigation'}
          aria-expanded={isOpen}
          className="touch-target w-11 h-11 flex items-center justify-center text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[57px] z-40 bg-black/60 backdrop-blur-xs flex flex-col">
          <div className="bg-[#181818] border-b border-neutral-800 p-4 space-y-2 max-h-[calc(100vh-60px)] overflow-y-auto">
            <nav className="space-y-1 text-sm font-medium">
              {ADMIN_LINKS.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`touch-target flex items-center gap-3 px-3 py-3 rounded-xl min-h-[48px] transition-colors ${
                      isActive
                        ? 'bg-[#234F9E] text-white font-semibold'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
              <Link
                href="/"
                target="_blank"
                className="touch-target flex items-center justify-between px-3 py-3 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white min-h-[44px]"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  <span>View Live Storefront</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Live</span>
              </Link>

              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="touch-target w-full flex items-center gap-2 px-3 py-3 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-neutral-900/60 min-h-[44px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
