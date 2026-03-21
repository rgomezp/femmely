import Link from "next/link";
import type { Category } from "@/lib/db/schema";

export function CategoryBar({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div className="flex min-w-min gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="min-h-11 shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-card)] transition hover:border-[var(--color-accent)]"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
