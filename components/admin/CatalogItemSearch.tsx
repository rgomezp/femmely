"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { DraftOutfitItem } from "./ItemSortableList";

export type CatalogSearchHit = {
  id: string;
  outfitId: string;
  asin: string;
  title: string;
  affiliateUrl: string;
  imageUrl: string;
  priceCents: number | null;
  currency: string;
  displayLabel: string;
  garmentCategory: string;
  sourceOutfitTitle: string;
  sourceOutfitSlug: string;
};

export function CatalogItemSearch({
  excludeOutfitId,
  onAdd,
}: {
  excludeOutfitId?: string;
  onAdd: (row: Omit<DraftOutfitItem, "tempId" | "serverId">) => void;
}) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hits, setHits] = useState<CatalogSearchHit[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (debounced.length < 2) {
      setHits([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ q: debounced });
    if (excludeOutfitId) params.set("excludeOutfitId", excludeOutfitId);

    fetch(`/api/admin/outfit-items/search?${params.toString()}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Search failed");
        return data.items as CatalogSearchHit[];
      })
      .then((items) => {
        if (!cancelled) setHits(items);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Search failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, excludeOutfitId]);

  const copyRow = useCallback(
    (h: CatalogSearchHit) => {
      onAdd({
        asin: h.asin,
        title: h.title,
        affiliateUrl: h.affiliateUrl,
        imageUrl: h.imageUrl,
        priceCents: h.priceCents,
        currency: h.currency,
        displayLabel: h.displayLabel,
        garmentCategory: h.garmentCategory,
      });
    },
    [onAdd],
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-neutral-800">Reuse from other outfits</p>
      <p className="mt-1 text-xs text-neutral-600">
        Search by product title, label, or ASIN. The same product may appear in more than one outfit—each row
        shows where it was saved. Add copies the link, image, and sizing fields into this outfit.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type at least 2 characters…"
        className="mt-3 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
      />
      {loading ? <p className="mt-2 text-xs text-neutral-500">Searching…</p> : null}
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      {debounced.length >= 2 && !loading && hits.length === 0 && !error ? (
        <p className="mt-2 text-xs text-neutral-500">No matches.</p>
      ) : null}
      {hits.length > 0 ? (
        <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto">
          {hits.map((h) => (
            <li
              key={h.id}
              className="flex gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-2"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                {h.imageUrl ? (
                  <Image src={h.imageUrl} alt="" fill className="object-contain" sizes="56px" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-neutral-900">{h.title}</p>
                <p className="truncate text-xs text-neutral-500">
                  {h.sourceOutfitTitle} · ASIN {h.asin}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyRow(h)}
                className="shrink-0 self-center rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
