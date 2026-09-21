import React from 'react';
import { Metadata } from 'next';
import { getAllBooks, getAllOwnedProducts } from '../../lib/search/catalogSearch';
import { BookCard } from '../../components/ui/BookCard';
import { AffiliateDisclosure } from '../../components/ui/AffiliateDisclosure';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Books, PDFs & Knowledge Resources',
  description: 'Curated books, field guides, and digital templates on focus, business economics, and creator systems.'
};

export default function BooksPage() {
  const books = getAllBooks();
  const owned = getAllOwnedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <Breadcrumbs items={[{ label: 'Books & Knowledge Resources' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
          Curated Reading & Knowledge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Books, Guides & Practical Wisdom
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          Skip generic airport bestsellers. We hand-pick books and digital guides that build enduring mental frameworks for deep focus, commercial acumen, and daily creative discipline.
        </p>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      {/* 1. Our Direct Publisher Guides */}
      <section className="bg-[#F2EBDD]/60 border border-[#E0D3BC] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold">
              In-House Publications
            </span>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mt-0.5">
              EveryAge Digital Field Guides & Notion Systems
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Authored directly by our editorial staff. Delivered immediately in PDF & Notion formats.
            </p>
          </div>
          <Link
            href="/shop/own-products"
            className="text-xs font-semibold text-[#1D438A] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All In-House Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {owned.map(item => (
            <div
              key={item.id}
              className="bg-white border border-[#E2E5EB] rounded-2xl p-5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Direct Download
                  </span>
                  <span className="font-mono text-neutral-400">{item.fileFormat}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mt-2">
                  <Link href={`/shop/own-products/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                  {item.tagline}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-base font-bold text-neutral-900">
                  ${item.price.toFixed(2)}
                </span>
                <Link
                  href={`/shop/own-products/${item.slug}`}
                  className="px-3.5 py-1.5 bg-[#1D438A] text-white text-xs font-semibold rounded-lg hover:bg-[#153266] transition-colors"
                >
                  View Guide
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Editorial Curated Book Recommendations */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-neutral-200 pb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900">
              Vetted Books on Focus & Business
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Available in print, Kindle, and audiobook via verified book merchants.
            </p>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {books.length} Selected Texts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
