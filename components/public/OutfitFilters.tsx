"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/lib/db/schema";

export function OutfitFilters({ categories }: { categories: Category[] }) {
  const sp = useSearchParams();
  const sort = sp.get("sort") || "newest";

  const href = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(sp.toString());
    mutate(p);
    const q = p.toString();
    return q ? `/outfits?${q}` : "/outfits";
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Sort:</span>
        <Link
          href={href((p) => p.delete("sort"))}
          className={`font-label inline-flex min-h-9 items-center justify-center rounded-xl px-4 py-2 text-xs uppercase tracking-widest ${sort === "newest" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"}`}
        >
          Newest
        </Link>
        <Link
          href={href((p) => p.set("sort", "items"))}
          className={`font-label inline-flex min-h-9 items-center justify-center rounded-xl px-4 py-2 text-xs uppercase tracking-widest ${sort === "items" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"}`}
        >
          Most items
        </Link>
        <Link
          href={href((p) => p.set("sort", "title"))}
          className={`font-label inline-flex min-h-9 items-center justify-center rounded-xl px-4 py-2 text-xs uppercase tracking-widest ${sort === "title" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"}`}
        >
          A–Z
        </Link>
      </div>
      {categories.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Category:</span>
          <Link
            href={href((p) => p.delete("category"))}
            className={`font-label inline-flex min-h-9 items-center justify-center rounded-xl px-4 py-2 text-xs uppercase tracking-widest ${!sp.get("category") ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={href((p) => p.set("category", c.slug))}
              className={`font-label inline-flex min-h-9 items-center justify-center rounded-xl px-4 py-2 text-xs uppercase tracking-widest ${sp.get("category") === c.slug ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
