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
        className="touch-target md:hidden p-2.5 text-neutral-600 hover:text-neutral-900 rounded-full transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] p-3 shadow-md z-30 animate-in slide-in-from-top duration-200">
          <form action="/search" method="GET" className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              name="q"
              placeholder="Search products, books, guides..."
              className="w-full pl-9 pr-20 py-2.5 bg-[#F7F7F4] border border-[#E4E7EC] rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-hidden focus:border-[#234F9E]"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 bg-[#234F9E] text-white text-xs font-semibold rounded-lg hover:bg-[#193B7A] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </>
  );
}
