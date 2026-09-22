import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Info 
} from 'lucide-react';
import { 
  searchCatalog, 
  getAllCollections, 
  getAllBooks, 
  getAllCategories, 
  getAllOwnedProducts 
} from '../lib/search/catalogSearch';
import { ProductCard } from '../components/ui/ProductCard';
import { CollectionCard } from '../components/ui/CollectionCard';
import { BookCard } from '../components/ui/BookCard';
import { AffiliateDisclosure } from '../components/ui/AffiliateDisclosure';
import { EmailSignup } from '../components/ui/EmailSignup';

export default function HomePage() {
  const featuredSearch = searchCatalog({ editorialPickOnly: true, sortBy: 'editorial_picks' });
  const featuredProducts = featuredSearch.items.slice(0, 4);
  const collections = getAllCollections().slice(0, 3);
  const books = getAllBooks().slice(0, 3);
  const categories = getAllCategories();
  const ownedProducts = getAllOwnedProducts();

  const searchExamples = [
    'Ergonomic mouse',
    'Desk lighting',
    'Books for deep work',
    'Notion operating systems',
    'Minimal desk setup',
    'Practical stationery'
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. Hero Section */}
      <section className="pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="hero">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Eyebrow, Headings, Intro & Action Links */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Independent Editorial Discovery & Affiliate Commerce</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                Find things worth buying, reading, and using.
              </h1>

              <p className="text-sm sm:text-base leading-relaxed max-w-xl">
                Curated products, useful books, digital resources, and everyday recommendations—with clear information before you click.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#234F9E] text-xs sm:text-sm font-semibold hover:bg-neutral-100 transition-colors"
                >
                  <span>Start browsing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/assistant"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/25 text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#A9C4F2]" />
                  <span>Ask the shopping assistant</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Search Form Inside Hero */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white/5 border border-white/15 p-5 sm:p-6 rounded-2xl backdrop-blur-xs">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A9C4F2] font-semibold block mb-2">
                  Instant Catalog Search
                </span>
                <form action="/search" method="GET" className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#A9C4F2] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search ergonomic mouse, habit books..."
                    className="w-full pl-10 pr-24 py-3 rounded-xl text-xs sm:text-sm focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3.5 py-1.5 bg-white text-[#234F9E] text-xs font-semibold rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </form>

                {/* Quick search chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 text-left">
                  <span className="text-[11px] text-[#A9C4F2]">Popular:</span>
                  {searchExamples.map(term => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="text-[11px] text-[#C9D6EE] hover:text-white bg-white/10 border border-white/15 rounded-full px-2.5 py-0.5 hover:bg-white/20 transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The beige disclosure banner moves BELOW the hero and keeps its warm tone */}
        <div className="disclosure-banner rounded-xl p-4 mt-6 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#B7791F] shrink-0" />
            <span>
              <strong>Editorial Transparency:</strong> As an Amazon Associate I earn from qualifying purchases. We recommend items with zero sponsored bias in ranking.
            </span>
          </div>
          <Link
            href="/affiliate-disclosure"
            className="underline font-medium hover:text-[#151515] shrink-0 text-[11px]"
          >
            Methodology & Disclosure &rarr;
          </Link>
        </div>
      </section>

      {/* 2. Popular Categories Bar */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-t border-b border-[#E4E7EC] py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="p-3 bg-white rounded-xl border border-neutral-200/80 hover:border-[#234F9E]/50 transition-colors flex flex-col justify-between group"
            >
              <span className="text-xs font-bold text-neutral-800 group-hover:text-[#234F9E] transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-neutral-400 mt-2 font-mono">
                {cat.count} verified pick{cat.count > 1 ? 's' : ''} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Editorial Picks */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#234F9E] font-semibold">
              Vetted & Tested
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Editorial Choices
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Selected for durability, space economy, and verified practical utility.
            </p>
          </div>
          <Link
            href="/shop?sort=editorial_picks"
            className="text-xs font-semibold text-[#234F9E] hover:underline flex items-center gap-1"
          >
            <span>View All ({featuredSearch.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(item => (
            <ProductCard key={item.product.id} item={item} />
          ))}
        </div>
      </section>

      {/* 4. Curated Collections */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#234F9E] font-semibold">
              Thematic Setups
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Curated Collections
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Cohesive kits with clear selection criteria—no bloated recommendations.
            </p>
          </div>
          <Link
            href="/collection/home-office-starter-kit"
            className="text-xs font-semibold text-[#234F9E] hover:underline flex items-center gap-1"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map(col => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* 5. AI Shopping Receptionist Callout Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#151515] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Shopping Concierge</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-snug">
              Need a tailored recommendation? Ask our digital receptionist.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Describe your desk space, budget, preferred merchant, or format. Our receptionist runs deterministic searches over our vetted database and explains exactly why an item fits or where it falls short.
            </p>
            <div className="pt-2">
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#234F9E] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#193B7A] transition-colors"
              >
                <span>Launch Shopping Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 w-full md:w-80 text-xs space-y-3">
            <div className="flex items-center gap-2 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Retrieval-grounded catalog search</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transparent limitation notices</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Never invents prices or false availability</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero sponsored bias in ranking</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Books & Knowledge Resources */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#234F9E] font-semibold">
              Essential Reading
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Books, Guides & Knowledge
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Foundational ideas on deep work, commercial economics, and habit mastery.
            </p>
          </div>
          <Link
            href="/books"
            className="text-xs font-semibold text-[#234F9E] hover:underline flex items-center gap-1"
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

      {/* 7. Our Own Digital Products */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#EFEDFB]/40 border border-[#D9D2F5] rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#6D5BD0] font-semibold">
                Direct Publisher Products
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
                Published by EveryAge Digital
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Field-tested guides, legal templates, and Notion workspaces created in-house. Instant digital delivery with 30-day money-back guarantee.
              </p>
            </div>
            <Link
              href="/shop/own-products"
              className="text-xs font-semibold text-[#234F9E] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore Direct Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ownedProducts.map(prod => (
              <div
                key={prod.id}
                className="product-card bg-white p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span className="badge-digital font-semibold px-2 py-0.5 rounded text-xs">
                      Direct Digital Download
                    </span>
                    <span className="font-mono text-neutral-400">{prod.fileFormat}</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    <Link href={`/shop/own-products/${prod.slug}`} className="product-title transition-colors">
                      {prod.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {prod.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Included Deliverables:
                    </span>
                    <ul className="text-xs text-neutral-700 space-y-1">
                      {prod.includedItems.slice(0, 2).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#18794E] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-neutral-900 product-price">
                      ${prod.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-500 ml-1 uppercase">{prod.currency}</span>
                  </div>

                  <Link
                    href={`/shop/own-products/${prod.slug}`}
                    className="btn-view-deal text-xs font-semibold"
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border border-[#E4E7EC] bg-white rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#234F9E] font-semibold">
              Editorial Independence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              How our recommendations work.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              We never accept money to inflate product rankings. We maintain direct affiliate partnerships so that when you choose to buy via our links, merchants pay us a small referral fee at zero extra cost to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-neutral-100">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                1. Rigorous Selection
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Products undergo hands-on testing or deep specification verification against primary manufacturer documents.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                2. Honest Limitations
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every product page clearly states who the product is NOT suitable for, so you avoid costly purchasing mistakes.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                3. Price Freshness Checks
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Prices and availability fluctuate. When an offer has not been refreshed recently, we prompt you to check the live merchant price.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <AffiliateDisclosure variant="banner" isAmazon />
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <EmailSignup />
      </section>
    </div>
  );
}
