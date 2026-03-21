import Image from "next/image";
import Link from "next/link";
import type { Outfit } from "@/lib/db/schema";

export function OutfitCard({
  outfit,
  itemCount,
  categoryName,
}: {
  outfit: Outfit;
  itemCount: number;
  categoryName?: string;
}) {
  return (
    <Link
      href={`/outfits/${outfit.slug}`}
      className="group mb-3 block break-inside-avoid min-[1024px]:mb-6"
    >
      <article className="overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition hover:shadow-md">
        <div className="relative aspect-[3/4] w-full bg-[var(--color-bg)]">
          <Image
            src={outfit.heroImageUrl}
            alt={outfit.heroImageAlt || outfit.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="p-3">
          {categoryName ? (
            <span className="mb-1 inline-block rounded-lg bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">
              {categoryName}
            </span>
          ) : null}
          <h2 className="font-semibold text-[var(--color-text-primary)]">{outfit.title}</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </article>
    </Link>
  );
}
