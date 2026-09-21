'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '../../context/WishlistContext';
import { getProductById, getAllBooks } from '../../lib/search/catalogSearch';
import { ProductCard } from '../../components/ui/ProductCard';
import { BookCard } from '../../components/ui/BookCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { AffiliateDisclosure } from '../../components/ui/AffiliateDisclosure';
import { Bookmark, Trash2, Scale, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { savedProductIds, savedBookIds, clearSaved } = useWishlist();
  const allBooks = getAllBooks();

  const savedProducts = savedProductIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const savedBooks = savedBookIds
    .map(id => allBooks.find(b => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const totalSaved = savedProducts.length + savedBooks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E2E5EB]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#1D438A] font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Private Local Storage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
            Your Saved Wishlist ({totalSaved})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Saved on your device. No registration or account tracking required.
          </p>
        </div>

        {totalSaved > 0 && (
          <div className="flex items-center gap-2">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1D438A] text-white rounded-lg text-xs font-semibold hover:bg-[#153266] transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Products</span>
            </Link>
            <button
              type="button"
              onClick={clearSaved}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E2E5EB] text-neutral-600 rounded-lg text-xs font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear List</span>
            </button>
          </div>
        )}
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      {totalSaved === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E2E5EB] rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">Your saved list is empty</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Click the bookmark icon on any product or book card while browsing to save it to this private list for later review.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1D438A] text-white text-xs font-semibold rounded-lg hover:bg-[#153266] transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Saved Products */}
          {savedProducts.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Saved Hardware & Essentials ({savedProducts.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProducts.map(item => (
                  <ProductCard key={item.product.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Saved Books */}
          {savedBooks.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                Saved Books & Reading ({savedBooks.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
