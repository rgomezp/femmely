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
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Sort:</span>
        <Link
          href={href((p) => p.delete("sort"))}
          className={`min-h-9 rounded-lg px-3 py-1 text-sm ${sort === "newest" ? "bg-[var(--color-accent)]/15 font-medium text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
        >
          Newest
        </Link>
        <Link
          href={href((p) => p.set("sort", "items"))}
          className={`min-h-9 rounded-lg px-3 py-1 text-sm ${sort === "items" ? "bg-[var(--color-accent)]/15 font-medium text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
        >
          Most items
        </Link>
        <Link
          href={href((p) => p.set("sort", "title"))}
          className={`min-h-9 rounded-lg px-3 py-1 text-sm ${sort === "title" ? "bg-[var(--color-accent)]/15 font-medium text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
        >
          A–Z
        </Link>
      </div>
      {categories.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">Category:</span>
          <Link
            href={href((p) => p.delete("category"))}
            className={`min-h-9 rounded-lg px-3 py-1 text-sm ${!sp.get("category") ? "bg-[var(--color-accent)]/15 font-medium text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={href((p) => p.set("category", c.slug))}
              className={`min-h-9 rounded-lg px-3 py-1 text-sm ${sp.get("category") === c.slug ? "bg-[var(--color-accent)]/15 font-medium text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
