import Link from "next/link";
import { GARMENT_CATEGORY_LABELS, SIZING_CATEGORY_SLUGS } from "@/lib/sizing/types";

export function SizeGuideNav({ active }: { active: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <nav className="no-scrollbar flex min-w-min gap-2">
        {SIZING_CATEGORY_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/size-guide/${slug}`}
            className={`font-label inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-xs uppercase tracking-widest ${
              active === slug
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {GARMENT_CATEGORY_LABELS[slug]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
