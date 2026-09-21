import React from 'react';

interface SponsoredBadgeProps {
  className?: string;
}

export function SponsoredBadge({ className = '' }: SponsoredBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-200 text-neutral-700 border border-neutral-300 ${className}`}
    >
      Sponsored
    </span>
  );
}
