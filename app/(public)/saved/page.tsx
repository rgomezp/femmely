"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Outfit } from "@/lib/db/schema";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitCard } from "@/components/public/OutfitCard";
import { Icon } from "@/components/ui/Icon";
import {
  clearAllSavedOutfits,
  getSavedOutfits,
  notifySavedOutfitsChanged,
} from "@/lib/saved-outfits";

type ApiOutfitRow = Outfit & {
  itemCount: number;
  cardImageUrl: string;
  primaryCategoryName?: string;
};

export default function SavedOutfitsPage() {
  const [rows, setRows] = useState<ApiOutfitRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    const ids = getSavedOutfits();
    if (ids.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = encodeURIComponent(ids.join(","));
    fetch(`/api/outfits?ids=${q}&limit=100`)
      .then((res) => (res.ok ? res.json() : { outfits: [] }))
      .then((data: { outfits: ApiOutfitRow[] }) => {
        setRows(Array.isArray(data.outfits) ? data.outfits : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleClearAll = () => {
    if (!confirm("Remove all saved outfits?")) return;
    clearAllSavedOutfits();
    notifySavedOutfitsChanged();
    setRows([]);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl text-on-surface">Your Saved Looks</h1>
          <p className="font-body mt-2 text-lg text-on-surface-variant">
            Outfits you&apos;ve bookmarked for later.
          </p>
        </div>
        {rows.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 text-on-surface-variant font-label text-xs uppercase tracking-widest transition-colors hover:text-error"
          >
            <Icon name="delete_sweep" className="text-lg" />
            Clear all
          </button>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-10 text-center font-body text-on-surface-variant">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="mx-auto mt-16 flex max-w-md flex-col items-center text-center">
          <Icon name="bookmark" className="text-6xl text-on-surface-variant/40" filled />
          <p className="font-body mt-6 text-on-surface-variant">
            No saved looks yet. Browse outfits and tap the bookmark to save them here.
          </p>
          <Link
            href="/outfits"
            className="font-label mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-[10px] uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
          >
            Browse outfits
          </Link>
        </div>
      ) : (
        <MasonryGrid className="mt-8 md:mt-10">
          {rows.map((row) => {
            const { itemCount, cardImageUrl, primaryCategoryName, ...outfit } = row;
            return (
              <OutfitCard
                key={outfit.id}
                outfit={outfit as Outfit}
                itemCount={itemCount}
                cardImageUrl={cardImageUrl}
                primaryCategoryName={primaryCategoryName}
                onBookmarkChange={(saved) => {
                  if (!saved) {
                    setRows((prev) => prev.filter((r) => r.id !== outfit.id));
                  }
                }}
              />
            );
          })}
        </MasonryGrid>
      )}
    </div>
  );
}
