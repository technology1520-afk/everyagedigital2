import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  getCollectionBySlugAsync, 
  getAllBooksAsync,
  getAllCollectionsAsync
} from '../../../lib/search/catalogSearch';
import { catalogRepository } from '../../../lib/db/repository';
import { BookCard } from '../../../components/ui/BookCard';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { ShareButton } from '../../../components/ui/ShareButton';
import { BundleProductList, BundleItem } from '../../../components/collection/BundleProductList';
import { Check, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const collections = await getAllCollectionsAsync();
  return collections.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlugAsync(slug);
  if (!collection) return { title: 'Collection Not Found' };

  return {
    title: `${collection.title} — Curated Bundle & Kit`,
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
  const collection = await getCollectionBySlugAsync(slug);

  if (!collection) {
    notFound();
  }

  // 1. Resolve live products in collection from Supabase repository
  const rawProducts = await Promise.all(
    collection.productIds.map(id => catalogRepository.getProductById(id))
  );
  const products = rawProducts.filter((item): item is NonNullable<typeof item> => Boolean(item));

  // Map to BundleItem view models with live offers & affiliate URLs
  const bundleItems: BundleItem[] = products.map(p => {
    const offer = catalogRepository.getOfferForProduct(p.id);
    const price = offer && typeof offer.price === 'number' && !isNaN(offer.price) ? offer.price : 0;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      imageUrl: p.imageUrl,
      price,
      originalPrice: offer?.originalPrice,
      merchantName: offer?.merchantName || p.sourceProvider || 'Direct Merchant',
      affiliateUrl: offer?.affiliateUrl || p.officialUrl || '#',
      whyCurated: p.bestFor || p.editorialNotes || p.description,
      sourceProductId: p.sourceProductId
    };
  });

  // 2. Resolve companion books in collection (if any)
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
      <div className="rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-purple-200/50 dark:border-white/10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Text Summary */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Metadata Bar with ShareButton on the right */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 font-semibold">
                    Curated Bundle
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    Reviewed {new Date(collection.lastReviewedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <ShareButton
                  title={collection.title}
                  text={collection.subtitle}
                />
              </div>

              {/* High-Contrast Hero Title & Subtitle */}
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                {collection.title}
              </h1>

              <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                {collection.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {collection.introduction}
              </p>
            </div>

            {/* Selection Criteria Box */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block mb-2.5">
                Vetting Criteria for This Bundle:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {collection.selectionCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cover Media */}
          <div className="lg:col-span-5 bg-slate-950/40 min-h-[300px] lg:min-h-full">
            <img
              src={collection.coverImage}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Interactive Bundle Product List + Sticky Checkout Bar */}
      <BundleProductList
        items={bundleItems}
        collectionTitle={collection.title}
      />

      {/* Included Books & Knowledge Guides (if any) */}
      {books.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-purple-200/40 dark:border-white/10">
          <div className="flex items-baseline justify-between pb-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Companion Reading & Guides ({books.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
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
