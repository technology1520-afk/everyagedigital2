import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  getCollectionBySlug, 
  getProductById, 
  getAllBooks,
  getAllBooksAsync
} from '../../../lib/search/catalogSearch';
import { COLLECTIONS } from '../../../data/seedCatalog';
import { ProductCard } from '../../../components/ui/ProductCard';
import { BookCard } from '../../../components/ui/BookCard';
import { AffiliateDisclosure } from '../../../components/ui/AffiliateDisclosure';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { Check, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLLECTIONS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: 'Collection Not Found' };

  return {
    title: `${collection.title} — Curated Collection`,
    description: `${collection.subtitle} ${collection.introduction.slice(0, 150)}...`,
    openGraph: {
      title: collection.title,
      description: collection.subtitle,
      images: [{ url: collection.coverImage }]
    }
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  // Resolve products in collection
  const products = collection.productIds
    .map(id => getProductById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  // Resolve books in collection
  const allBooks = await getAllBooksAsync();
  const books = (collection.bookIds || [])
    .map(id => allBooks.find(b => b.id === id))
    .filter((book): book is NonNullable<typeof book> => Boolean(book));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Collections', href: '/' },
          { label: collection.title }
        ]}
      />

      {/* Collection Hero */}
      <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Text Summary */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                  Curated Collection
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  Reviewed {new Date(collection.lastReviewedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                {collection.title}
              </h1>

              <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
                {collection.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {collection.introduction}
              </p>
            </div>

            {/* Selection Criteria Box */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2.5">
                Vetting Criteria for This Kit:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {collection.selectionCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cover Media */}
          <div className="lg:col-span-5 bg-slate-950/50 min-h-[300px] lg:min-h-full">
            <img
              src={collection.coverImage}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <AffiliateDisclosure variant="banner" isAmazon />

      {/* Included Products */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
          <h2 className="font-serif text-2xl font-bold text-white">
            Selected Products ({products.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Direct merchant fulfillment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(item => (
            <ProductCard key={item.product.id} item={item} />
          ))}
        </div>
      </section>

      {/* Included Books & Knowledge Guides (if any) */}
      {books.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
            <h2 className="font-serif text-2xl font-bold text-white">
              Companion Reading & Guides ({books.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Deepen practical mastery
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
