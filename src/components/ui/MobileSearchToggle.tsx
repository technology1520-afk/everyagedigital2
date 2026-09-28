'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export function MobileSearchToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile search"
        aria-expanded={isOpen}
        className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white glass glass-hover rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-strong p-3 shadow-2xl z-30 animate-in slide-in-from-top duration-200">
          <form action="/search" method="GET" className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              name="q"
              placeholder="Search products, books, guides..."
              className="w-full pl-9 pr-20 py-2.5 bg-purple-500/5 dark:bg-white/5 border border-purple-200/60 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-hidden focus:border-purple-400 dark:focus:border-blue-400/50 backdrop-blur-md transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-purple-600/25 dark:shadow-blue-500/25 transition-all cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </>
  );
}
