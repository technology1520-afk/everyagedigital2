import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { 
  searchCatalog, 
  searchCatalogAsync,
  getAllCollections, 
  getAllCollectionsAsync,
  getAllBooks, 
  getAllBooksAsync,
  getAllCategories, 
  getAllCategoriesAsync,
  getAllOwnedProducts 
} from '../lib/search/catalogSearch';
import { Collection } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import { CollectionCard } from '../components/ui/CollectionCard';
import { BookCard } from '../components/ui/BookCard';
import { EmailSignup } from '../components/ui/EmailSignup';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const featuredSearch = await searchCatalogAsync({ editorialPickOnly: true, sortBy: 'editorial_picks' });
  const featuredProducts = featuredSearch.items.slice(0, 4);
  const collections = (await getAllCollectionsAsync({ storefrontOnly: true })).slice(0, 3);
  const books = (await getAllBooksAsync()).slice(0, 3);
  const rawCategories = (await getAllCategoriesAsync()) || getAllCategories();
  const categories = rawCategories.filter(
    cat => cat.name.toLowerCase() !== 'general' && cat.name.toLowerCase() !== 'uncategorized'
  );
  const ownedProducts = getAllOwnedProducts();

  const searchExamples = [
    'Ergonomic mouse',
    'Desk lighting',
    'Books for deep work',
    'Notion systems',
    'Mechanical switches'
  ];

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className="glass-strong rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Eyebrow, Headings, Intro & Action Links */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-neutral-800 dark:text-neutral-200 text-xs font-mono uppercase tracking-wider">
                <SlidersHorizontal className="w-3 h-3 text-neutral-500 dark:text-neutral-400 shrink-0" />
                <span>Issue No. 04 • Independent Editorial Index</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.15] text-neutral-900 dark:text-neutral-50">
                Objects and texts worth owning, testing, and keeping.
              </h1>

              <p className="text-sm sm:text-base leading-relaxed max-w-xl text-neutral-600 dark:text-neutral-400 font-normal">
                Curated desktop gear, foundational books, and verified tools. Evaluated on physical ergonomics, build endurance, and realistic trade-offs before you buy.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="touch-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white text-xs font-mono uppercase tracking-wider transition-colors min-h-[40px]"
                >
                  <span>Browse Index</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/assistant"
                  className="touch-target inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass glass-hover text-neutral-800 dark:text-neutral-200 text-xs font-mono uppercase tracking-wider transition-all min-h-[40px]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                  <span>Consult Concierge</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Search Form Inside Hero */}
            <div className="lg:col-span-5 w-full">
              <div className="glass p-5 sm:p-6 rounded-xl">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-semibold block mb-2.5">
                  Direct Specimen Query
                </span>
                <form action="/search" method="GET" className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Search mechanical keyboard, habit books..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono glass text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-500 dark:focus:border-white/40 min-h-[42px] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white text-xs font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0 min-h-[42px] font-semibold"
                  >
                    Query
                  </button>
                </form>

                {/* Quick search chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3.5 text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Focus:</span>
                  {searchExamples.map(term => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="text-[11px] font-mono text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white glass glass-hover rounded px-2.5 py-1 transition-all"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Bar */}
      {categories.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="border-t border-b border-neutral-200/80 dark:border-neutral-800 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="p-3.5 glass glass-hover rounded-xl flex flex-col justify-between group min-h-[64px]"
              >
                <span className="font-serif text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline decoration-neutral-400 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2 font-mono uppercase tracking-wider">
                  {cat.count} specimen{cat.count > 1 ? 's' : ''} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Featured Editorial Picks (Editorial Magazine Hierarchy: Card 0 is Issue Spotlight) */}
      <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-semibold">
              Vetted & Field-Tested
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
              Issue Spotlight & Editorial Picks
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Selected for industrial durability, space economy, and verified practical utility.
            </p>
          </div>
          <Link
            href="/shop?sort=editorial_picks"
            className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1.5 touch-target whitespace-nowrap shrink-0 ml-4"
          >
            <span>View All ({featuredSearch.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((item, idx) => (
              <ProductCard
                key={item.product.id}
                item={item}
                index={idx}
                priority={idx < 2}
                isLead={idx === 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 p-10 text-center my-4 space-y-2 shadow-xs">
            <p className="font-serif text-neutral-900 dark:text-white font-bold text-base">No editorial picks published yet.</p>
            <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Our team is currently vetting specimens for this issue. Check back shortly.
            </p>
          </div>
        )}
      </section>

      {/* 4. Curated Collections */}
      <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-semibold">
              Thematic Setups
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
              Curated Collections
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Cohesive kits with clear selection criteria—no bloated recommendations.
            </p>
          </div>
          <Link
            href="/collections"
            className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 ml-4"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {collections.length > 0 ? (
          <div className={`grid gap-6 w-full ${collections.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
            {collections.map((col: Collection) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 p-10 text-center my-4 space-y-2 shadow-xs">
            <p className="font-serif text-neutral-900 dark:text-white font-bold text-base">Collections updating</p>
            <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Our editorial team is updating gear bundles. Check back shortly or browse all individual products.
            </p>
          </div>
        )}
      </section>

      {/* 5. Editorial Concierge Callout Banner */}
      <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className="glass-strong text-neutral-900 dark:text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-neutral-800 dark:text-neutral-200 text-xs font-mono uppercase tracking-wider">
              <SlidersHorizontal className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
              <span>Deterministic Concierge</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal tracking-tight text-neutral-900 dark:text-white leading-snug">
              Need a tailored recommendation? Query our catalog concierge.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Describe your desk space, budget, preferred merchant, or format. Our concierge executes deterministic searches over our vetted database and explains exactly why an item fits or where it falls short.
            </p>
            <div className="pt-2">
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white text-white text-xs font-mono uppercase tracking-wider rounded-lg transition-colors"
              >
                <span>Launch Concierge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass rounded-xl p-5 w-full md:w-80 text-xs font-mono space-y-3 text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
              <span>Retrieval-grounded catalog index</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
              <span>Transparent trade-off disclosures</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
              <span>Never invents prices or phantom stock</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
              <span>Zero sponsored bias in search ranking</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Books & Knowledge Resources (Hidden when no curated books are available) */}
      {books.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-semibold">
                Essential Texts
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
                Books, Guides & Foundations
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Rigorous ideas on deep work, commercial economics, and habit mastery.
              </p>
            </div>
            <Link
              href="/books"
              className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 ml-4"
            >
              <span>View All Books</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Direct Publisher Products */}
      <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className="glass-strong rounded-2xl p-8 sm:p-10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-semibold">
                Direct Publisher Products
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
                Published by EveryAge Digital
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Field-tested guides, legal templates, and Notion workspaces created in-house. Instant digital delivery with 30-day money-back guarantee.
              </p>
            </div>
            <Link
              href="/shop/own-products"
              className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1.5 shrink-0"
            >
              <span>Explore Direct Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ownedProducts.map(prod => (
              <div
                key={prod.id}
                className="rounded-xl glass glass-hover p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                    <span className="badge-digital font-semibold px-2 py-0.5 rounded-full text-[10px] glass-pill">
                      Direct Digital Download
                    </span>
                    <span className="text-[10px] uppercase tracking-wider">{prod.fileFormat}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white">
                    <Link href={`/shop/own-products/${prod.slug}`} className="hover:underline decoration-neutral-400 transition-colors">
                      {prod.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                    {prod.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-200/40 dark:border-white/10 space-y-1.5">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Deliverables:
                    </span>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      {prod.includedItems.slice(0, 2).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/40 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xl font-bold text-neutral-900 dark:text-white">
                      ${prod.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 ml-1 uppercase">{prod.currency}</span>
                  </div>

                  <Link
                    href={`/shop/own-products/${prod.slug}`}
                    className="btn-view-deal text-xs font-mono uppercase"
                  >
                    <span>View Guide &rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Methodology & Trust Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <div className="glass-strong rounded-2xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300 font-semibold">
              Editorial Independence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900 dark:text-white mt-1">
              How our recommendations work.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
              We never accept payment to inflate product rankings. We maintain transparent affiliate partnerships so that when you choose to buy via our links, merchants pay us a standard referral fee at zero extra cost to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-neutral-200/40 dark:border-white/10">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-bold mb-1.5">
                1. Rigorous Selection
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Products undergo hands-on testing or deep specification verification against primary manufacturer documents.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-bold mb-1.5">
                2. Honest Limitations
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Every product page clearly states who the product is NOT suitable for, preventing costly purchasing mismatches.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-bold mb-1.5">
                3. Price Freshness Checks
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Merchant prices fluctuate. When an offer has not been refreshed recently, we prompt you to verify the live merchant price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription */}
      <section className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
        <EmailSignup />
      </section>
    </div>
  );
}
