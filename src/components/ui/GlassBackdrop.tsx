import React from 'react';

/**
 * Fixed ambient gradient backdrop with subtle colorful orbs and noise texture.
 * Essential foundation for frosted glassmorphism across EveryAge Digital.
 * Uses GPU-promoted layers, zero pointer events, and fixed positioning.
 */
export function GlassBackdrop() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dark Theme Ambient Color Orbs (low saturation for WCAG AA text contrast) */}
      <div className="hidden dark:block">
        {/* Top-Right Deep Indigo Orb */}
        <div 
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#1e2a5a]/45 blur-[120px] will-change-transform" 
        />
        {/* Mid-Left Subtle Teal Orb */}
        <div 
          className="absolute top-1/3 -left-36 w-[540px] h-[540px] rounded-full bg-[#0f3d3a]/40 blur-[130px] will-change-transform" 
        />
        {/* Bottom Warm Muted Amber Orb */}
        <div 
          className="absolute -bottom-36 right-1/4 w-[580px] h-[580px] rounded-full bg-[#4a2f0a]/35 blur-[140px] will-change-transform" 
        />
      </div>

      {/* Light Theme Ambient Pastel Orbs (subtle cream, sky, lavender) */}
      <div className="block dark:hidden">
        {/* Top-Right Soft Sky Blue Orb */}
        <div 
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-sky-200/40 blur-[120px] will-change-transform" 
        />
        {/* Mid-Left Soft Lavender Orb */}
        <div 
          className="absolute top-1/3 -left-36 w-[540px] h-[540px] rounded-full bg-indigo-100/45 blur-[130px] will-change-transform" 
        />
        {/* Bottom Soft Warm Amber Orb */}
        <div 
          className="absolute -bottom-36 right-1/4 w-[580px] h-[580px] rounded-full bg-amber-100/50 blur-[140px] will-change-transform" 
        />
      </div>

      {/* Subtle Noise Texture Overlay (feTurbulence data-URI at 0.03 opacity to eliminate banding) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
