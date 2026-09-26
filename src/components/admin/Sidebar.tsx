'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Link2, 
  Layers, 
  Boxes,
  FileBox, 
  Bot, 
  Settings, 
  ExternalLink, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { logoutAdminAction } from '../../app/actions/admin';

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/links', label: 'Affiliate Links', icon: Link2 },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/collections', label: 'Collections', icon: Boxes },
  { href: '/admin/own-products', label: 'Own Products', icon: FileBox },
  { href: '/admin/assistant', label: 'Assistant Logs', icon: Bot },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-2xl text-white flex-shrink-0 flex-col justify-between border-r border-white/10 relative z-10">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 overflow-hidden rounded-xl bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="EveryAge Digital Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs tracking-tight text-white uppercase block leading-tight truncate">
                EVERYAGE DIGITAL
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase block truncate">
                OWNER CONTROL CENTER
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-mono shrink-0">
            v1.0
          </span>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1 text-sm font-medium">
          {ADMIN_NAV_LINKS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600/20 text-white border border-blue-500/30 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Utility Actions */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 rounded-lg border border-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            <span>Storefront Live</span>
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">&rarr;</span>
        </Link>

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

export default Sidebar;
