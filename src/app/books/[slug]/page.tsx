import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBookBySlugAsync, getProductById } from '../../../lib/search/catalogSearch';
import { MerchantBadge } from '../../../components/ui/MerchantBadge';
import { WishlistButton } from '../../../components/ui/WishlistButton';
import { AffiliateDisclosure } from '../../../components/ui/AffiliateDisclosure';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { ProductCard } from '../../../components/ui/ProductCard';
import { ExternalLink, Check, BookOpen, Clock, Target } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlugAsync(slug);
  if (!book) return { title: 'Book Not Found' };

  return {
    title: `${book.title} by ${book.author} — Review & Key Takeaways`,
    description: `${book.description} Curated review and direct merchant purchase options via EveryAge Digital.`,
    openGraph: {
      title: book.title,
      description: book.description,
      images: [{ url: book.coverImage }]
    }
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBookBySlugAsync(slug);

  if (!book) {
    notFound();
  }

  const isAmazon = book.merchant === 'Amazon';

  // Related products
  const relatedProducts = (book.relatedProductIds || [])
    .map(id => getProductById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Books', href: '/books' },
          { label: book.title }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Book Cover & Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[2/3] max-w-sm mx-auto w-full bg-[var(--surface-muted)] rounded-2xl overflow-hidden border border-[var(--border)] p-4 shadow-xs flex items-center justify-center">
            <div className="w-full h-full relative">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                sizes="(max-width: 1024px) 320px, 380px"
                priority
                className="object-contain"
              />
            </div>
            <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 z-10">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{book.format}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1">
            <span>License: {book.imageLicense}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyPill(
                book.difficulty
              )}`}
            >
              {book.difficulty}
            </span>
          </div>

          <div className="pt-2">
            <WishlistButton bookId={book.id} variant="labeled" className="w-full justify-center py-2.5" />
          </div>
        </div>

        {/* Right Column: Information & Key Takeaways */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                Authored by {book.author}
              </span>
              <MerchantBadge merchant={book.merchant} />
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text)] leading-tight">
              {book.title}
            </h1>

            <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Offer & Link Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-[var(--text)]">
                  ${book.price.toFixed(2)}
                </span>
                <span className="text-xs text-[var(--text-secondary)] ml-1 uppercase">{book.currency}</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Verified {new Date(book.lastCheckedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="pt-2">
              <a
                href={book.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="w-full btn-view-deal justify-center py-3.5 px-6 rounded-xl text-sm font-semibold gap-2 shadow-sm"
              >
                <span>{isAmazon ? 'View Book at Amazon' : 'Visit Book Merchant'}</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>
            </div>

            <AffiliateDisclosure variant="compact" isAmazon={isAmazon} />
          </div>

          {/* Target Audience */}
          <div className="bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text)] mb-1.5">
              <Target className="w-4 h-4 text-[var(--accent)]" />
              <span>Who Should Read This</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {book.targetAudience}
            </p>
          </div>

          {/* Key Learnings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              Core Lessons & Frameworks:
            </h3>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              {book.keyLearnings.map((learning, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)]">
                  <Check className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{learning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Companion Physical Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-[var(--border)] space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[var(--text)]">
              Recommended Companion Tools
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Physical gear and systems that help implement the principles in this book.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(item => (
              <ProductCard key={item.product.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
