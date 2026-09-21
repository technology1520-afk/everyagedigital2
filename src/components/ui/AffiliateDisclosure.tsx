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
  if (variant === 'banner') {
    return (
      <aside
        aria-label="Affiliate Disclosure"
        className={`bg-[#F2EBDD]/60 border border-[#E4D7C0] px-4 py-3 rounded-lg text-xs text-[#564935] flex items-start gap-2.5 ${className}`}
      >
        <Info className="w-4 h-4 text-[#8C6D3B] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-[#382E1E]">Editorial Transparency:</strong>{' '}
          EveryAge Digital is reader-supported. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you.
          {isAmazon && (
            <span className="block mt-1 font-medium text-[#2E2517]">
              As an Amazon Associate I earn from qualifying purchases.
            </span>
          )}
          {' '}<Link href="/affiliate-disclosure" className="underline hover:text-black ml-1">Learn about our evaluation methodology & disclosure policy &rarr;</Link>
        </div>
      </aside>
    );
  }

  if (variant === 'compact') {
    return (
      <p className={`text-[11px] text-neutral-500 leading-snug ${className}`}>
        {isAmazon
          ? 'As an Amazon Associate I earn from qualifying purchases.'
          : 'Affiliate link: we may earn a commission at no cost to you.'}{' '}
        <Link href="/affiliate-disclosure" className="underline hover:text-neutral-700">
          Disclosure
        </Link>
      </p>
    );
  }

  return (
    <div
      className={`text-xs text-neutral-500 border-t border-neutral-200/80 pt-3 mt-4 flex items-center justify-between gap-2 ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        {isAmazon
          ? 'As an Amazon Associate I earn from qualifying purchases.'
          : 'Purchases through our links may generate an affiliate commission.'}
      </span>
      <Link
        href="/affiliate-disclosure"
        className="text-[11px] underline hover:text-neutral-800 shrink-0"
      >
        Details
      </Link>
    </div>
  );
}
