import React from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';

interface AffiliateDisclosureProps {
  variant?: 'inline' | 'banner' | 'card' | 'compact';
  isAmazon?: boolean;
  className?: string;
}

export function AffiliateDisclosure({
  variant = 'inline',
  isAmazon = false,
  className = ''
}: AffiliateDisclosureProps) {
  // Banner variant permanently disabled per site-wide clean design standards.
  // Compliance is maintained via the global footer and compact badge disclosures.
  if (variant === 'banner') {
    return null;
  }

  if (variant === 'compact') {
    return (
      <p className={`text-[11px] text-slate-400 leading-snug ${className}`}>
        {isAmazon
          ? 'As an Amazon Associate I earn from qualifying purchases.'
          : 'Affiliate link: we may earn a commission at no cost to you.'}{' '}
        <Link href="/affiliate-disclosure" className="underline hover:text-white text-slate-300">
          Disclosure
        </Link>
      </p>
    );
  }

  return (
    <div
      className={`text-xs text-slate-400 border-t border-white/10 pt-3 mt-4 flex items-center justify-between gap-2 ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {isAmazon
          ? 'As an Amazon Associate I earn from qualifying purchases.'
          : 'Purchases through our links may generate an affiliate commission.'}
      </span>
      <Link
        href="/affiliate-disclosure"
        className="text-[11px] underline hover:text-white text-slate-300 shrink-0"
      >
        Details
      </Link>
    </div>
  );
}
