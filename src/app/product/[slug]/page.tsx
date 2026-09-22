import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getProductBySlug, 
  getSourceEvidenceForProduct, 
  searchCatalog, 
  getAllCollections 
} from '../../../lib/search/catalogSearch';
import { PRODUCTS } from '../../../data/seedCatalog';
import { MerchantBadge } from '../../../components/ui/MerchantBadge';
import { PriceStatus } from '../../../components/ui/PriceStatus';
import { FreshnessLabel } from '../../../components/ui/FreshnessLabel';
import { WishlistButton } from '../../../components/ui/WishlistButton';
import { CompareButton } from '../../../components/ui/CompareButton';
import { AffiliateDisclosure } from '../../../components/ui/AffiliateDisclosure';
import { EvidencePanel } from '../../../components/ui/EvidencePanel';
import { ProductCard } from '../../../components/ui/ProductCard';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { ProductGallery } from '../../../components/ui/ProductGallery';
import { StickyProductCTA } from '../../../components/ui/StickyProductCTA';
import { 
  ExternalLink, 
  Check, 
  XCircle, 
  Award, 
  Globe, 
  Layers, 
  ArrowRight,
  Info 
} from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const enriched = getProductBySlug(slug);
  if (!enriched) return { title: 'Product Not Found' };

  return {
    title: `${enriched.product.name} — Review & Alternatives`,
    description: `${enriched.product.description} Vetted by EveryAge Digital with clear trade-offs, pricing checks, and merchant options.`,
    openGraph: {
      title: enriched.product.name,
      description: enriched.product.description,
      images: [{ url: enriched.product.imageUrl }]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const enriched = getProductBySlug(slug);

  if (!enriched) {
    notFound();
  }

  const { product, offer, freshness } = enriched;
  const evidences = getSourceEvidenceForProduct(product.id);
  const isAmazon = offer?.merchantName === 'Amazon';

  // Alternatives / Related in category
  const alternatives = searchCatalog({ category: product.category })
    .items.filter(item => item.product.id !== product.id)
    .slice(0, 3);

  // Find related collection if any
  const relatedCollection = getAllCollections().find(c => c.productIds.includes(product.id));

  // JSON-LD structured data (Product schema for editorial review)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: offer ? {
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.currency,
      availability: offer.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
      seller: {
        '@type': 'Organization',
        name: offer.merchantName
      }
    } : undefined
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 md:pb-12 space-y-10 sm:space-y-12">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: product.category, href: `/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
          { label: product.name }
        ]}
      />

      {/* Main Product Showcase - Tablet 60/40 split (md:col-span-7/md:col-span-5), Desktop 5/7 split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
        {/* Gallery Col: 12 on phone, 7 on md (60%), 5 on lg */}
        <div className="md:col-span-7 lg:col-span-5 space-y-4">
          <ProductGallery
            images={[
              product.imageUrl,
              product.imageUrl.includes('?') ? `${product.imageUrl}&auto=format&fit=crop&w=1000&q=80` : product.imageUrl
            ]}
            altText={product.altText}
            editorialBadge={product.editorialBadge}
            imageSource={product.imageSource}
            imageLicense={product.imageLicense}
          />

          {/* Action buttons with touch targets >= 44px */}
          <div className="flex items-center gap-3 pt-1">
            <WishlistButton productId={product.id} variant="labeled" className="flex-1 justify-center py-2.5 min-h-[44px]" />
            <CompareButton productId={product.id} variant="labeled" className="flex-1 justify-center py-2.5 min-h-[44px]" />
          </div>
        </div>

        {/* Info Col: 12 on phone, 5 on md (40%), 7 on lg */}
        <div className="md:col-span-5 lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                {product.brand}
              </span>
              {offer && <MerchantBadge merchant={offer.merchantName} />}
              <span className="text-xs text-neutral-400 font-mono">
                {product.category} &rsaquo; {product.subcategory}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
              {product.name}
            </h1>

            <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Primary Purchase Card */}
          <div className="bg-white border border-[#E2E5EB] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <PriceStatus offer={offer} freshness={freshness} size="lg" />
              <FreshnessLabel freshness={freshness} />
            </div>

            {offer?.shippingNote && (
              <p className="text-xs text-neutral-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{offer.shippingNote}</span>
              </p>
            )}

            {/* Inline CTA (Tablet & Desktop only; Phone uses StickyProductCTA) */}
            <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-2">
              {offer ? (
                <a
                  href={`/api/go/${product.id}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors shadow-sm min-h-[44px]"
                >
                  <span>
                    {freshness?.isStale
                      ? 'Check Live Price at Merchant'
                      : offer.merchantName === 'Amazon'
                      ? 'View Offer at Amazon'
                      : `View on ${offer.merchantName}`}
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              ) : (
                <div className="p-3 bg-neutral-100 rounded-lg text-xs text-neutral-600">
                  No direct partner merchant offer currently available.
                </div>
              )}
            </div>

            {/* Affiliate compliance statement */}
            <div className="pt-2">
              <AffiliateDisclosure variant="compact" isAmazon={isAmazon} />
            </div>
          </div>

          {/* Who Should Buy vs Avoid (Crucial Editorial Requirement) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Best For</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {product.bestFor}
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                <XCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Not Ideal For</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {product.notFor}
              </p>
            </div>
          </div>

          {/* Features, Benefits & Limitations */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Key Features & Specifications
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-neutral-200/70">
                    <Check className="w-3.5 h-3.5 text-[#1D438A] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Real-World Trade-Offs & Limitations
              </h3>
              <ul className="space-y-2 text-xs text-neutral-600">
                {product.limitations.map((limit, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-neutral-200/70">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Editorial Notes */}
          <div className="bg-[#F7F7F4] border border-[#E2E5EB] rounded-xl p-4 text-xs text-neutral-700 space-y-1">
            <span className="font-semibold text-neutral-900 block">Editorial Assessment Note:</span>
            <p className="leading-relaxed text-neutral-600">{product.editorialNotes}</p>
            <div className="text-[11px] text-neutral-400 pt-1 flex items-center gap-2">
              <span>Testing Status: {product.handsOnTested ? 'Hands-on Tested' : 'Verified Spec Audit'}</span>
              <span>•</span>
              <span>Confidence: {product.editorialConfidence}</span>
            </div>
          </div>

          {/* Source Verification Evidence */}
          <EvidencePanel evidences={evidences} />
        </div>
      </div>

      {/* Related Curated Collection (if part of one) */}
      {relatedCollection && (
        <div className="bg-[#F2EBDD]/40 border border-[#E0D3BC] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-8 h-8 text-[#1D438A] shrink-0" />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                Part of a Curated Setup
              </span>
              <h3 className="text-base font-bold text-neutral-900">
                {relatedCollection.title}
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                {relatedCollection.subtitle}
              </p>
            </div>
          </div>
          <Link
            href={`/collection/${relatedCollection.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E2E5EB] rounded-lg text-xs font-semibold text-[#1D438A] hover:bg-neutral-50 transition-colors shrink-0"
          >
            <span>View Full Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Alternative Recommendations */}
      {alternatives.length > 0 && (
        <section className="pt-8 border-t border-[#E2E5EB]">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-neutral-900">
                Alternative Recommendations
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Other tested options in {product.category} for different budgets or workflows.
              </p>
            </div>
            <Link href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-[#1D438A] font-semibold hover:underline">
              See all in {product.category} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            {alternatives.map(item => (
              <ProductCard key={item.product.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom CTA on Phone (Hidden on md+) */}
      <StickyProductCTA
        productId={product.id}
        productSlug={product.slug}
        offer={offer}
        freshness={freshness}
      />
    </div>
  );
}
