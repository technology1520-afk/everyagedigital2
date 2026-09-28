'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  altText: string;
  editorialBadge?: string;
  imageSource?: string;
  imageLicense?: string;
}

export function ProductGallery({
  images,
  altText,
  editorialBadge,
  imageSource,
  imageLicense
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const validImages = (images || []).filter(img => typeof img === 'string' && img.trim().length > 0);
  const galleryImages = validImages.length > 0 ? validImages : ['https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg'];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeIndex && index >= 0 && index < galleryImages.length) {
        setActiveIndex(index);
      }
    }
  };

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.clientWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  return (
    <div className="space-y-3">
      {/* Mobile Swipeable Carousel & Desktop Main View */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        {/* Swipeable Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              className="min-w-full snap-center relative aspect-square sm:aspect-4/3 md:aspect-square flex items-center justify-center p-6 bg-white dark:bg-neutral-900/80"
            >
              <Image
                src={src}
                alt={`${altText} - view ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 40vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Editorial Badge */}
        {editorialBadge && (
          <div className="absolute top-3 left-3 z-10 bg-neutral-900/90 text-white dark:bg-white/90 dark:text-neutral-950 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>{editorialBadge}</span>
          </div>
        )}

        {/* Dots Indicator for Mobile Carousel */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center items-center gap-1.5">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToImage(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  activeIndex === idx ? 'w-5 bg-neutral-900 dark:bg-white shadow-xs' : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Bar for Tablet / Desktop */}
      {galleryImages.length > 1 && (
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1">
          {galleryImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => scrollToImage(idx)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-white dark:bg-neutral-900/80 p-1 ${
                activeIndex === idx ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-400/30' : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Attribution */}
      {(imageSource || imageLicense) && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
          {imageSource && <span>Image: {imageSource}</span>}
          {imageLicense && (
            <span className="font-mono text-[10px] bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">
              {imageLicense}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
