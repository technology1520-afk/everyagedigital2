'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '../../types';
import { ArrowRight, Layers } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
  priority?: boolean;
}

export function CollectionCard({ collection, className = '', priority = false }: CollectionCardProps) {
  const totalItems = collection.productIds.length + (collection.bookIds?.length || 0);

  return (
    <article
      className={`product-card group rounded-2xl bg-white/[0.04] backdrop-blur-lg border border-white/10 hover:border-blue-400/40 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20 overflow-hidden flex flex-col justify-between ${className}`}
    >
      <div className="relative aspect-16/9 w-full bg-slate-950/40 overflow-hidden">
        <Link href={`/collection/${collection.slug}`} className="block w-full h-full relative">
          <Image
            src={collection.coverImage}
            alt={collection.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-2.5 left-2.5 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 z-10 shadow-lg">
          <Layers className="w-3 h-3 text-amber-400" />
          <span>{totalItems} Curated Items</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
            Curated Collection
          </span>
          <h3 className="font-semibold text-base sm:text-lg text-white leading-snug mt-1 group-hover:text-blue-300 transition-colors">
            <Link href={`/collection/${collection.slug}`} className="transition-colors">
              {collection.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {collection.subtitle}
          </p>

          {/* Criteria highlight */}
          {collection.selectionCriteria.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Vetting Rule
              </span>
              <p className="text-xs text-slate-300 italic line-clamp-1">
                &ldquo;{collection.selectionCriteria[0]}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-blue-400 min-h-[44px]">
          <Link href={`/collection/${collection.slug}`} className="touch-target inline-flex items-center gap-1 w-full justify-between hover:text-blue-300 transition-colors">
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
