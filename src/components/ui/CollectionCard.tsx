import React from 'react';
import Link from 'next/link';
import { Collection } from '../../types';
import { ArrowRight, Layers } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

export function CollectionCard({ collection, className = '' }: CollectionCardProps) {
  const totalItems = collection.productIds.length + (collection.bookIds?.length || 0);

  return (
    <article
      className={`group bg-white border border-[#E2E5EB] rounded-xl overflow-hidden hover:border-[#1D438A]/50 transition-all hover:shadow-md flex flex-col justify-between ${className}`}
    >
      <div className="relative aspect-16/9 w-full bg-[#F0F1ED] overflow-hidden">
        <img
          src={collection.coverImage}
          alt={collection.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-amber-400" />
          {totalItems} Curated Items
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
            Curated Collection
          </span>
          <h3 className="font-semibold text-lg text-neutral-900 leading-snug mt-1 group-hover:text-[#1D438A] transition-colors">
            <Link href={`/collection/${collection.slug}`}>
              {collection.title}
            </Link>
          </h3>
          <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
            {collection.subtitle}
          </p>

          {/* Criteria highlight */}
          {collection.selectionCriteria.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Vetting Rule
              </span>
              <p className="text-xs text-neutral-700 italic line-clamp-1">
                &ldquo;{collection.selectionCriteria[0]}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#1D438A]">
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
}
