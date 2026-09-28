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
      className={`group flex flex-col h-full rounded-xl bg-[#faf9f6] dark:bg-[#0d1117] border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 p-4 sm:p-5 shadow-xs transition-colors overflow-hidden ${className}`}
    >
      {/* Dedicated Image Studio Display Frame */}
      <div className="relative w-full aspect-[16/10] bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden flex items-center justify-center p-3 mb-3">
        <Link href={`/collections/${collection.slug}`} className="relative w-full h-full block overflow-hidden rounded-md">
          <Image
            src={bundleCoverImage}
            alt={collection.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-102 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-2.5 left-2.5 text-[9px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 z-10 shadow-xs">
          <Layers className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
          <span>{totalItems} {totalItems === 1 ? 'Specimen' : 'Specimens'}</span>
        </div>
      </div>

      {/* Content & Typography Scaling */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium mb-1">
          Curated Gear Kit
        </span>
        <h3 className="font-serif text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-100 tracking-tight line-clamp-1 mb-1.5">
          <Link href={`/collections/${collection.slug}`} className="hover:underline decoration-neutral-400 transition-colors">
            {collection.title}
          </Link>
        </h3>
        <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
          {collection.subtitle || collection.description || collection.introduction}
        </p>

        {/* Vetting Rule / Subtext */}
        {collection.selectionCriteria && collection.selectionCriteria.length > 0 && collection.selectionCriteria[0] ? (
          <p className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 italic line-clamp-1 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-2 mt-auto">
            &ldquo;{collection.selectionCriteria[0]}&rdquo;
          </p>
        ) : null}

        {/* CTA link / button */}
        <div className="pt-2">
          <Link
            href={`/collections/${collection.slug}`}
            className="text-xs font-mono uppercase tracking-wider text-neutral-900 dark:text-neutral-100 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Explore Kit</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CollectionCard;
