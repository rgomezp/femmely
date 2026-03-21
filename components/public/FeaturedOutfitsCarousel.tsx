"use client";

import { useCallback, useRef } from "react";
import type { Outfit } from "@/lib/db/schema";
import { OutfitCard } from "@/components/public/OutfitCard";

export type FeaturedCarouselOutfit = {
  outfit: Outfit;
  itemCount: number;
  cardImageUrl: string;
  primaryCategoryName?: string;
};

export function FeaturedOutfitsCarousel({ outfits }: { outfits: FeaturedCarouselOutfit[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.min(el.clientWidth * 0.85, 360) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  if (outfits.length === 0) return null;

  return (
    <section className="mt-16 border-t border-outline-variant pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-xl text-on-surface">Featured outfits</h2>
          <p className="font-body mt-1 max-w-xl text-sm text-on-surface-variant">
            Looks curated by the team—swipe or use the arrows to browse.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface shadow transition hover:bg-surface-container-high"
            aria-label="Scroll featured outfits left"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface shadow transition hover:bg-surface-container-high"
            aria-label="Scroll featured outfits right"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="no-scrollbar mt-6 flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
      >
        {outfits.map(({ outfit, itemCount, cardImageUrl, primaryCategoryName }) => (
          <div
            key={outfit.id}
            className="w-[min(280px,calc(100vw-3rem))] shrink-0 snap-start [&_.masonry-item]:mb-0"
          >
            <OutfitCard
              outfit={outfit}
              itemCount={itemCount}
              cardImageUrl={cardImageUrl}
              primaryCategoryName={primaryCategoryName}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="stroke-current">
      <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="stroke-current">
      <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
