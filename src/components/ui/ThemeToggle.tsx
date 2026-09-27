'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isHalloween?: boolean;
}

export function ThemeToggle({ isHalloween: initialIsHalloween }: ThemeToggleProps = {}) {
  const { setTheme, resolvedTheme, forcedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSeasonalHalloween, setIsSeasonalHalloween] = useState(initialIsHalloween ?? false);

  useEffect(() => {
    setMounted(true);
    const checkSeasonal = () => {
      const isHalloweenAttr = typeof document !== 'undefined' && document.documentElement.getAttribute('data-seasonal') === 'halloween';
      setIsSeasonalHalloween(Boolean(initialIsHalloween || isHalloweenAttr || forcedTheme === 'dark'));
    };
    checkSeasonal();
    const observer = new MutationObserver(checkSeasonal);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-seasonal'] });
    return () => observer.disconnect();
  }, [initialIsHalloween, forcedTheme]);

  const isHalloweenActive = initialIsHalloween || isSeasonalHalloween || (forcedTheme === 'dark' && typeof document !== 'undefined' && document.documentElement.getAttribute('data-seasonal') === 'halloween');

  // When Halloween mode is active: strictly lock to dark mode & replace Sun/Moon with a static 🎃 icon
  if (isHalloweenActive) {
    return (
      <div
        className="touch-target relative p-2 select-none flex items-center justify-center min-w-[40px] min-h-[40px] cursor-default"
        title="Spooky Season: Locked to Dark Mode 🎃"
        aria-label="Halloween Mode Active: Dark Theme Locked"
      >
        <span className="text-lg leading-none transition-transform hover:scale-125 duration-200" role="img" aria-label="Pumpkin">
          🎃
        </span>
      </div>
    );
  }

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
    if (isHalloweenActive || forcedTheme) return;
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
