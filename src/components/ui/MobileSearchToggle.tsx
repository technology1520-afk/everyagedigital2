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
        className="touch-target md:hidden p-2.5 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-full transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] p-3 shadow-md z-30 animate-in slide-in-from-top duration-200">
          <form action="/search" method="GET" className="relative flex items-center">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              name="q"
              placeholder="Search products, books, guides..."
              className="w-full pl-9 pr-20 py-2.5 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:bg-[var(--surface)] focus:outline-hidden focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </>
  );
}
