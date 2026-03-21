"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/db/schema";

export function CategoryBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  if (categories.length === 0) return null;

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div className="no-scrollbar flex min-w-min gap-4">
        <Link
          href="/outfits"
          className={`font-label shrink-0 whitespace-nowrap rounded-xl px-6 py-3 text-xs uppercase tracking-widest transition-colors ${
            pathname === "/" || pathname === "/outfits"
              ? "bg-primary text-on-primary"
              : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
          }`}
        >
          All
        </Link>
        {categories.map((c) => {
          const href = `/category/${c.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={c.id}
              href={href}
              className={`font-label shrink-0 whitespace-nowrap rounded-xl px-6 py-3 text-xs uppercase tracking-widest transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
