'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '../../types';
import { getCollectionBannerImage } from '../../lib/db/supabaseMapper';
import { ArrowRight, Layers } from 'lucide-react';

export interface CollectionCardProps {
  collection: Collection;
  className?: string;
  priority?: boolean;
}

export function CollectionCard({ collection, className = '', priority = false }: CollectionCardProps) {
  const totalItems = collection.activeProductCount ?? (collection.productIds.length + (collection.bookIds?.length || 0));

  const bundleCoverImage = getCollectionBannerImage(collection);

  return (
    <article
      className={`group flex flex-col h-full rounded-xl glass glass-hover p-4 sm:p-5 overflow-hidden ${className}`}
    >
      {/* Dedicated Image Studio Display Frame */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-3">
        <Link href={`/collections/${collection.slug}`} className="relative block w-full h-full">
          <Image
            src={bundleCoverImage}
            alt={collection.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full glass-pill text-white flex items-center gap-1.5 z-10 shadow-xs">
          <Layers className="w-3 h-3 text-neutral-200" />
          <span>{totalItems} {totalItems === 1 ? 'Specimen' : 'Specimens'}</span>
        </div>
      </div>

      {/* Content & Typography Scaling */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
          Curated Gear Kit
        </span>
        <h3 className="font-serif text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-100 tracking-tight line-clamp-1 mb-1.5">
          <Link href={`/collections/${collection.slug}`} className="hover:underline decoration-neutral-400 transition-colors">
            {collection.title}
          </Link>
        </h3>
        <div className="mb-3">
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {collection.subtitle || collection.description || collection.introduction}
          </p>
          <Link
            href={`/collections/${collection.slug}`}
            className="inline-block text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mt-1 underline underline-offset-2 transition-colors"
          >
            Read kit brief &rarr;
          </Link>
        </div>

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
