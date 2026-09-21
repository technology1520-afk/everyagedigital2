import React from 'react';
import Link from 'next/link';
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

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col md:flex-row text-neutral-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#151515] text-white flex-shrink-0 flex flex-col justify-between border-r border-neutral-800">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#234F9E]" />
                <span className="font-bold text-sm tracking-tight text-white uppercase">EveryAge Digital</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mt-0.5">
                Owner Control Center
              </span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
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
        <div className="p-4 border-t border-neutral-800 space-y-2 text-xs">
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dense Utility Top Bar */}
        <header className="h-14 bg-white border-b border-neutral-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Search catalog, links, merchants..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F7F4] border border-neutral-200 rounded-md focus:outline-none focus:border-[#234F9E] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Compliance Guard Active</span>
            </div>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-[#234F9E] text-white hover:bg-[#193B7A] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
