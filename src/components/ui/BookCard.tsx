'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Book } from '../../types';
import { WishlistButton } from './WishlistButton';
import { BookOpen, ExternalLink, CheckCircle, BookMarked } from 'lucide-react';

interface BookCardProps {
  book: Book;
  className?: string;
  priority?: boolean;
}

export function BookCard({ book, className = '', priority = false }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const isAmazon = book.merchant === 'Amazon';

  const getDifficultyPill = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20';
      case 'comprehensive':
      case 'intermediate':
        return 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20';
      case 'advanced':
        return 'bg-[var(--coral-soft)] text-[var(--coral)] border border-[var(--coral)]/20';
      default:
        return 'bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]';
    }
  };

  return (
    <article
      className={`product-card group flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden p-4 sm:p-5 transition-all ${className}`}
    >
      {/* Top Section: Cover Left + Info Right */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Cover 2:3 Left Column (fixed w-24 on phone, w-28 on sm+) */}
        <div className="w-24 sm:w-28 shrink-0">
          <Link
            href={`/books/${book.slug}`}
            className="block aspect-2/3 w-full rounded-xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)]/70 p-1.5 relative group-hover:border-[var(--accent)] transition-colors shadow-xs"
            tabIndex={-1}
            aria-hidden="true"
          >
            {book.coverImage && !imageError ? (
              <div className="w-full h-full relative">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  priority={priority}
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              /* Designed Placeholder Fallback */
              <div className="w-full h-full bg-[var(--featured)] rounded flex flex-col justify-between p-2 border-l-[3px] border-[var(--accent)] text-left select-none">
                <BookMarked className="w-4 h-4 text-[var(--accent)] opacity-80" />
                <div className="space-y-1">
                  <span className="font-serif text-[10px] sm:text-[11px] font-bold text-[var(--text)] line-clamp-3 leading-tight block">
                    {book.title}
                  </span>
                  <span className="font-serif text-[9px] text-[var(--text-secondary)] line-clamp-1 block">
                    {book.author}
                  </span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Right Info Column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header Row: Format Badge Chip + Wishlist Button */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/15 shrink-0">
              <BookOpen className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{book.format}</span>
            </span>
            <WishlistButton bookId={book.id} />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-[var(--text)] leading-snug line-clamp-2">
            <Link
              href={`/books/${book.slug}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {book.title}
            </Link>
          </h3>

          {/* Byline */}
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            by {book.author}
          </p>

          {/* Description: strictly 2 lines */}
          <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>

      {/* CORE TAKEAWAY Block: Fixed min-height to ensure vertical rhythm */}
      {book.keyLearnings && book.keyLearnings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] min-h-[72px] flex flex-col justify-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] block mb-1">
            Core Takeaway
          </span>
          <div className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
            <CheckCircle className="w-3.5 h-3.5 text-[var(--success)] shrink-0 mt-0.5" />
            <span className="line-clamp-2">{book.keyLearnings[0]}</span>
          </div>
        </div>
      )}

      {/* Bottom Pinned Section: Price + Difficulty Pill and CTAs */}
      <div className="mt-auto pt-4 border-t border-[var(--border)] flex flex-col gap-3">
        {/* Price and Difficulty Row */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[var(--text)]">
            ${book.price.toFixed(2)}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyPill(
              book.difficulty
            )}`}
          >
            {book.difficulty}
          </span>
        </div>

        {/* CTA Button Row */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <a
            href={book.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="btn-view-deal flex-1 py-2.5 px-3 text-xs font-semibold gap-1.5 justify-center min-h-[44px]"
          >
            <span>{isAmazon ? 'View on Amazon' : 'View Book'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
          <Link
            href={`/books/${book.slug}`}
            className="touch-target py-2.5 px-4 rounded-xl text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-muted)] border border-[var(--border)] transition-colors text-center min-h-[44px]"
          >
            Summary
          </Link>
        </div>
      </div>
    </article>
  );
}
