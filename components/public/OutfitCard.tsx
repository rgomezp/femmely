import Image from "next/image";
import Link from "next/link";
import type { Outfit } from "@/lib/db/schema";
import { Icon } from "@/components/ui/Icon";

function aspectClassForOutfitId(id: string): string {
  const n =
    id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 3;
  if (n === 0) return "aspect-[3/4]";
  if (n === 1) return "aspect-square";
  return "aspect-[4/5]";
}

export function OutfitCard({
  outfit,
  itemCount,
  categoryName,
  primaryCategoryName,
  cardImageUrl,
}: {
  outfit: Outfit;
  itemCount: number;
  /** When viewing a category page, repeats the page category on each card. */
  categoryName?: string;
  /** First category from DB when not on a category page. */
  primaryCategoryName?: string;
  cardImageUrl: string;
}) {
  const label = categoryName ?? primaryCategoryName;
  const aspect = aspectClassForOutfitId(outfit.id);

  return (
    <div className="masonry-item">
      <Link href={`/outfits/${outfit.slug}`} className="group block">
        <article className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card transition-all duration-500 hover:shadow-card-hover">
          <div className={`relative w-full overflow-hidden bg-surface-container ${aspect}`}>
            {cardImageUrl ? (
              <Image
                src={cardImageUrl}
                alt={outfit.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-body text-sm text-on-surface-variant">
                No image
              </div>
            )}
            <span className="absolute right-4 top-4 bg-surface-bright/80 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-primary backdrop-blur-md rounded-lg">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
          <div className="p-6">
            {label ? (
              <span className="font-label mb-2 block text-[10px] uppercase tracking-widest text-on-surface-variant">
                {label}
              </span>
            ) : null}
            <h2 className="font-headline text-xl text-on-surface transition-colors group-hover:text-primary">
              {outfit.title}
            </h2>
            <div className="mt-4 flex items-center justify-end gap-3">
              <span className="shrink-0 text-on-surface-variant" aria-hidden>
                <Icon name="bookmark" className="text-xl" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}
