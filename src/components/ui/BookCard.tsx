'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '../../types';
import { MerchantBadge } from './MerchantBadge';
import { WishlistButton } from './WishlistButton';
import { BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className = '' }: BookCardProps) {
  const isAmazon = book.merchant === 'Amazon';

  return (
    <article
      className={`group bg-white border border-[#E2E5EB] rounded-xl overflow-hidden hover:border-[#1D438A]/50 transition-all hover:shadow-md flex flex-col justify-between ${className}`}
    >
      <div className="relative aspect-3/2 w-full bg-[#F0F1ED] overflow-hidden">
        <Link href={`/books/${book.slug}`} className="block w-full h-full">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-2.5 left-2.5 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1.5">
          <BookOpen className="w-3 h-3 text-amber-400" />
          {book.format}
        </div>
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton bookId={book.id} />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>By {book.author}</span>
            <MerchantBadge merchant={book.merchant} />
          </div>

          <h3 className="font-semibold text-base text-neutral-900 leading-snug group-hover:text-[#1D438A] transition-colors">
            <Link href={`/books/${book.slug}`}>
              {book.title}
            </Link>
          </h3>

          <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
            {book.description}
          </p>

          {/* Key Learnings */}
          {book.keyLearnings.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Core Takeaway
              </span>
              <div className="flex items-start gap-1.5 text-xs text-neutral-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{book.keyLearnings[0]}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-neutral-900">
              ${book.price.toFixed(2)}
            </span>
            <span className="text-[11px] text-neutral-500">
              Difficulty: {book.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={book.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors shadow-xs"
            >
              <span>{isAmazon ? 'View on Amazon' : 'View Book'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
            <Link
              href={`/books/${book.slug}`}
              className="py-2 px-3 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 border border-neutral-200 transition-colors"
            >
              Summary
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
