'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '../../types';
import { ArrowRight, Layers } from 'lucide-react';

export interface CollectionCardProps {
  collection: Collection;
  className?: string;
  priority?: boolean;
}

export function CollectionCard({ collection, className = '', priority = false }: CollectionCardProps) {
  const totalItems = collection.activeProductCount ?? (collection.productIds.length + (collection.bookIds?.length || 0));

  const rawCover = collection.cover_image || collection.coverImage;
  const isDesk = typeof rawCover === 'string' && (rawCover.includes('photo-1518455027359-f3f8164ba6bd') || rawCover.includes('/desk.jpg'));
  const isPlaceholder = !rawCover || rawCover.includes('placeholder') || isDesk;

  const bundleCoverImage = (!isPlaceholder && rawCover)
    ? rawCover
    : collection.products?.[0]?.image_url || collection.products?.[0]?.imageUrl || '/placeholder-bundle.png';

  return (
    <article
      className={`group flex flex-col h-full rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 border border-white/10 overflow-hidden shadow-lg hover:border-white/20 transition-all ${className}`}
    >
      {/* Constrained Aspect Ratio Image Frame */}
      <div className="relative w-full aspect-[16/10] bg-slate-950/40 overflow-hidden flex items-center justify-center p-3">
        <Link href={`/collections/${collection.slug}`} className="relative w-full h-full block overflow-hidden rounded-xl">
          <Image
            src={bundleCoverImage}
            alt={collection.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="h-full w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 border border-white/10 flex items-center gap-1.5 z-10 shadow-xs">
          <Layers className="w-3 h-3 text-amber-300" />
          <span>{totalItems} {totalItems === 1 ? 'Curated Item' : 'Curated Items'}</span>
        </div>
      </div>

      {/* Content & Typography Scaling */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 mb-1">
          Curated Collection
        </span>
        <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 mb-2">
          <Link href={`/collections/${collection.slug}`} className="hover:text-blue-300 transition-colors">
            {collection.title}
          </Link>
        </h3>
        <p className="text-xs leading-relaxed text-slate-300 line-clamp-2 mb-3">
          {collection.subtitle || collection.description || collection.introduction}
        </p>

        {/* Vetting Rule / Subtext */}
        {collection.selectionCriteria && collection.selectionCriteria.length > 0 && collection.selectionCriteria[0] ? (
          <p className="text-[11px] text-slate-400 italic line-clamp-1 border-t border-white/5 pt-2 mt-auto">
            &ldquo;{collection.selectionCriteria[0]}&rdquo;
          </p>
        ) : null}

        {/* CTA link / button */}
        <div className="pt-1">
          <Link
            href={`/collections/${collection.slug}`}
            className="mt-3 text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CollectionCard;
