'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden="true"
        className="touch-target w-11 h-11 flex items-center justify-center p-2.5 text-transparent rounded-full"
      >
        <span className="w-5 h-5 md:w-4 md:h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="touch-target relative p-2.5 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--accent-soft)] rounded-full transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
    >
      {isDark ? (
        <Sun className="w-5 h-5 md:w-4 md:h-4 text-[#E0B25C] transition-transform rotate-0 hover:rotate-45 duration-200" />
      ) : (
        <Moon className="w-5 h-5 md:w-4 md:h-4 text-[#234F9E] transition-transform -rotate-12 hover:rotate-0 duration-200" />
      )}
    </button>
  );
}
