import Link from "next/link";
import { GARMENT_CATEGORY_LABELS, SIZING_CATEGORY_SLUGS } from "@/lib/sizing/types";

export function SizeGuideNav({ active }: { active: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <nav className="flex min-w-min gap-2 border-b border-[var(--color-border)] pb-2">
        {SIZING_CATEGORY_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/size-guide/${slug}`}
            className={`min-h-11 shrink-0 rounded-t-xl px-4 py-2 text-sm font-medium ${
              active === slug
                ? "bg-[var(--color-accent-secondary)]/15 text-[var(--color-accent-secondary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {GARMENT_CATEGORY_LABELS[slug]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
