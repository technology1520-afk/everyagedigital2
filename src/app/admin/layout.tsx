import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Plus, 
  Search,
  ShieldCheck
} from 'lucide-react';
import { logoutAdminAction } from '../actions/admin';
import { AdminMobileNav } from '../../components/admin/AdminMobileNav';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100 font-sans antialiased relative overflow-x-hidden">
      {/* Ambient background with subtle, fixed-position blur spheres */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Light blue sphere */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-400/25 dark:bg-sky-500/10 blur-3xl" />
        {/* Indigo sphere */}
        <div className="absolute top-1/4 -right-28 w-[32rem] h-[32rem] rounded-full bg-indigo-500/20 dark:bg-indigo-600/15 blur-3xl" />
        {/* Purple sphere */}
        <div className="absolute bottom-10 left-1/4 w-[30rem] h-[30rem] rounded-full bg-purple-500/20 dark:bg-purple-600/15 blur-3xl" />
        {/* Secondary light blue sphere for viewport balance */}
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-3xl" />
      </div>

      {/* Mobile Top Navigation & Drawer */}
      <AdminMobileNav />

      {/* Desktop Sidebar Navigation */}
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
                <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block mt-0.5 truncate">
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
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-neutral-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Package className="w-4 h-4 text-neutral-400" />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/links"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Link2 className="w-4 h-4 text-neutral-400" />
              <span>Affiliate Links</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Layers className="w-4 h-4 text-neutral-400" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/own-products"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <FileBox className="w-4 h-4 text-neutral-400" />
              <span>Own Products</span>
            </Link>

            <Link
              href="/admin/assistant"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Bot className="w-4 h-4 text-neutral-400" />
              <span>Assistant Logs</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] text-neutral-500">Live</span>
          </Link>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-900/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Dense Utility Top Bar */}
        <header className="h-14 backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border-b border-white/30 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Search catalog..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-lg focus:outline-none focus:border-[#234F9E] focus:bg-white text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 px-2 py-1 rounded-lg backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Compliance Guard Active</span>
            </div>

            <Link
              href="/admin/products/new"
              className="touch-target inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[#234F9E] text-white hover:bg-[#193B7A] transition-colors shadow-xs min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
