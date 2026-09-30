import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogRepository } from '../../../lib/db/repository';
import { enrichProduct } from '../../../lib/search/catalogSearch';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { MerchantBadge } from '../../../components/ui/MerchantBadge';
import { WishlistButton } from '../../../components/ui/WishlistButton';
import { 
  Sparkles, 
  Flame, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Check, 
  ExternalLink,
  GraduationCap,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DealDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: DealDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const product = (await catalogRepository.getProductBySlug(slug)) || catalogRepository.getProductBySlugSync(slug);

  if (!product) {
    return {
      title: 'Deal Not Found',
      description: 'The requested deal or promotional perk could not be found.'
    };
  }

  const title = `${product.name} | Verified Perks & Deals`;
  const description = product.description;
  const imageUrl = product.imageUrl || product.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : []
    }
  };
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const product = (await catalogRepository.getProductBySlug(slug)) || catalogRepository.getProductBySlugSync(slug);

  if (!product) {
    notFound();
  }

  const enriched = enrichProduct(product);
  const { offer } = enriched;

  const isFree = Boolean(
    product.is_free ||
    product.isFree ||
    product.price === 0 ||
    offer?.price === 0
  );

  const originalPrice = product.original_price ?? product.originalPrice ?? offer?.originalPrice ?? (isFree ? 95.88 : undefined);
  const currentPrice = isFree ? 0 : (product.price ?? offer?.price ?? 0);

  let discountPercent = product.discount_percent ?? product.discountPercent;
  if (discountPercent === undefined || discountPercent === null) {
    if (isFree) {
      discountPercent = 100;
    } else if (originalPrice && originalPrice > currentPrice) {
      discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    } else {
      discountPercent = 0;
    }
  }

  const claimUrl = product.affiliate_url || product.affiliateUrl || offer?.affiliateUrl || product.officialUrl || '#';
  const merchantName = product.merchant || offer?.merchantName || 'Direct Brand';
  const rawFacts = (product.deal_facts || product.dealFacts) as Record<string, string> | undefined;

  // Fallbacks for structured deal facts
  const dealFacts = {
    price: isFree ? 'FREE' : `$${currentPrice.toFixed(2)}`,
    value: rawFacts?.value || (originalPrice ? `$${originalPrice.toFixed(2)}/year` : '$95.88/year'),
    verification: rawFacts?.access || (product.deal_type === 'student' ? 'Student / Handshake Verification' : 'Verified Merchant Partner'),
    duration: rawFacts?.duration || '12 Months',
    discount: rawFacts?.discount || (isFree ? '100% OFF (1 Year)' : `${discountPercent}% OFF`)
  };

  // Structured claim steps
  const claimSteps: string[] = (product.claim_steps || product.claimSteps) && Array.isArray(product.claim_steps || product.claimSteps)
    ? (product.claim_steps || product.claimSteps)!
    : [
        'Log in to Handshake at app.joinhandshake.com/gemini with your university student account.',
        'Unlock the Google AI promotional offer on your Handshake dashboard.',
        'Activate using your preferred personal or university Google account.',
        'Add a payment method on Google Play to activate (no charges apply during the 12-month free term).'
      ];

  const rawImg = product.imageUrl || product.image_url;
  const displayImage = (rawImg && typeof rawImg === 'string' && rawImg.trim() !== '')
    ? rawImg
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  // Helper to render markdown links inside claim step text
  const renderStepContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 font-medium underline underline-offset-2 hover:text-emerald-300"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Deals & Perks Hub', href: '/deals' },
          { label: product.name }
        ]}
      />

      {/* ======================================================== */}
      {/* HERO BANNER: Emerald neon accents & glowing badges       */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 shadow-[0_8px_32px_rgba(16,185,129,0.1)]">
        {/* Glow ambient radial backgrounds */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              {isFree ? (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-[0_0_16px_rgba(16,185,129,0.5)]">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  100% FREE PERK
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500 text-white shadow-[0_0_16px_rgba(244,63,94,0.5)]">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-300" />
                  {discountPercent}% OFF
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium px-3 py-1 rounded-full text-emerald-400 border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {product.verified_date || 'Verified Live'}
              </span>

              {product.deal_type === 'student' && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium px-3 py-1 rounded-full text-teal-300 border border-teal-500/30 bg-teal-950/40">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student Verification
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {product.description}
            </p>

            {/* Pricing Row: Strikethrough original price next to glowing green badge */}
            <div className="flex flex-wrap items-baseline gap-4 pt-2">
              <div className="flex items-center gap-3">
                {originalPrice && originalPrice > 0 && (
                  <span className="line-through text-slate-400 dark:text-slate-500 text-xl sm:text-2xl font-mono">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
                {isFree ? (
                  <span className="font-mono text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    FREE
                  </span>
                ) : (
                  <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight px-3 py-1 rounded-xl bg-slate-900 dark:bg-white/10 border border-white/20">
                    ${currentPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {dealFacts.discount && (
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {dealFacts.discount}
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={claimUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98] cursor-pointer"
              >
                <span>Get this deal</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>

              <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 py-2 sm:py-0 px-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Direct Merchant / Portal Link</span>
              </div>
            </div>
          </div>

          {/* Hero Right Specimen Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/30 shadow-2xl">
              <Image
                src={displayImage}
                alt={product.altText || product.name || 'Deal Specimen'}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Watermark badge on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded border border-emerald-500/20 backdrop-blur-md">
                  {merchantName}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
                  Active Specimen
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2-COLUMN MAIN CONTENT: Claim Steps + Deal Facts Side Card */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column (8 cols): How to Claim It & Value Analysis */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION: How to Claim It */}
          <section className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  How to claim it
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Step-by-step activation guide
                </p>
              </div>
            </div>

            {/* Sequential numbered list with rounded step indicators */}
            <ol className="space-y-4">
              {claimSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 transition-colors hover:border-emerald-500/30"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    {idx + 1}
                  </div>
                  <div className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed pt-0.5">
                    {renderStepContent(step)}
                  </div>
                </li>
              ))}
            </ol>

            {/* Bottom Claim Action Direct Link */}
            <div className="pt-2">
              <a
                href={claimUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="w-full py-3.5 px-6 rounded-xl font-mono text-sm font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <span>Launch Claim Portal ({merchantName})</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </section>

          {/* SECTION: What is Included / Features */}
          {product.features && product.features.length > 0 && (
            <section className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>What&apos;s Included with this Perk</span>
              </h2>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feat, fIdx) => (
                  <li
                    key={fIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5"
                  >
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* SECTION: Editorial Stance & Terms to Know */}
          <section className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Editorial Notes &amp; Verification Terms</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                {product.editorialNotes || 'This perk is independently vetted by our editorial desk. We confirm eligibility requirements directly with partner distribution channels before listing.'}
              </p>

              {product.limitations && product.limitations.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300 uppercase tracking-wider font-mono">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Important Considerations</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    {product.limitations.map((lim, lIdx) => (
                      <li key={lIdx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): "Deal Facts" Side Card & Sticky Summary */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Deal Facts Side Card */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Structured Metadata
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                Deal Facts
              </h3>
            </div>

            {/* Facts Grid */}
            <div className="space-y-3.5 pt-2">
              {/* Fact: Price */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-white/10 text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                  Price
                </span>
                <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400 text-base">
                  {dealFacts.price}
                </span>
              </div>

              {/* Fact: Total Value */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-white/10 text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                  Total Value
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {dealFacts.value}
                </span>
              </div>

              {/* Fact: Verification */}
              <div className="flex items-start justify-between py-2 border-b border-slate-200/60 dark:border-white/10 text-sm gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-xs shrink-0">
                  Verification
                </span>
                <span className="font-mono font-medium text-slate-900 dark:text-slate-200 text-right text-xs">
                  {dealFacts.verification}
                </span>
              </div>

              {/* Fact: Duration */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-white/10 text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                  Duration
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {dealFacts.duration}
                </span>
              </div>

              {/* Fact: Merchant / Channel */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-white/10 text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                  Provider
                </span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {merchantName}
                </span>
              </div>
            </div>

            {/* Quick Action Button in side card */}
            <div className="pt-2 space-y-3">
              <a
                href={claimUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <span>Get this deal →</span>
              </a>

              <Link
                href="/deals"
                className="w-full py-2.5 px-4 rounded-xl font-mono text-xs text-center block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ← Back to Deals Hub
              </Link>
            </div>
          </div>

          {/* Guarantee / Zero Charges Box */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] p-5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero Unexpected Fees</span>
            </div>
            <p className="leading-relaxed">
              During the promotional term, no recurring subscription charges are incurred. Cancel or manage renewals anytime directly through your Google Play or merchant billing settings.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
