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
        className="touch-target md:hidden p-2 text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md rounded-xl transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-2xl bg-slate-950/90 border-b border-white/10 p-3 shadow-2xl z-30 animate-in slide-in-from-top duration-200">
          <form action="/search" method="GET" className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              name="q"
              placeholder="Search products, books, guides..."
              className="w-full pl-9 pr-20 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-400/50 backdrop-blur-md transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/25 transition-all"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </>
  );
}
