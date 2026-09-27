import React from 'react';

/**
 * Ambient overlay rendered when Spooky Halloween Mode is active.
 * Adds delicate corner spider web accents, warm ember floating glows,
 * and atmospheric lighting without obstructing user interaction.
 */
export function HalloweenAmbientOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
      {/* Top-Left Spider Web Accent */}
      <svg
        viewBox="0 0 100 100"
        className="fixed top-0 left-0 w-32 h-32 sm:w-44 sm:h-44 text-orange-500/20 dark:text-orange-500/30 pointer-events-none drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] transition-opacity duration-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0,0 L100,0" strokeDasharray="2 2" />
        <path d="M0,0 L0,100" strokeDasharray="2 2" />
        <path d="M0,0 L85,55" />
        <path d="M0,0 L55,85" />
        <path d="M0,0 L100,100" />
        {/* Concentric Web Arcs */}
        <path d="M20,0 Q20,20 0,20" />
        <path d="M40,0 Q40,40 0,40" />
        <path d="M60,0 Q60,60 0,60" />
        <path d="M80,0 Q80,80 0,80" />
        <path d="M100,0 Q100,100 0,100" />
      </svg>

      {/* Top-Right Spider Web Accent */}
      <svg
        viewBox="0 0 100 100"
        className="fixed top-0 right-0 w-32 h-32 sm:w-44 sm:h-44 text-orange-500/20 dark:text-orange-500/30 pointer-events-none -scale-x-100 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] transition-opacity duration-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0,0 L100,0" strokeDasharray="2 2" />
        <path d="M0,0 L0,100" strokeDasharray="2 2" />
        <path d="M0,0 L85,55" />
        <path d="M0,0 L55,85" />
        <path d="M0,0 L100,100" />
        {/* Concentric Web Arcs */}
        <path d="M20,0 Q20,20 0,20" />
        <path d="M40,0 Q40,40 0,40" />
        <path d="M60,0 Q60,60 0,60" />
        <path d="M80,0 Q80,80 0,80" />
        <path d="M100,0 Q100,100 0,100" />
      </svg>

      {/* Warm Pumpkin Ember Glow Spheres */}
      <div className="fixed -top-24 left-1/3 w-96 h-96 bg-orange-600/15 blur-[160px] rounded-full pointer-events-none animate-pulse duration-1000" />
      <div className="fixed top-1/2 -right-20 w-80 h-80 bg-purple-900/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-24 left-10 w-96 h-96 bg-amber-600/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}
