import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { GARMENT_CATEGORY_LABELS, isGarmentCategory } from "@/lib/sizing/types";
import { Icon } from "@/components/ui/Icon";

function aspectClassForItemId(id: string): string {
  const n = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 3;
  if (n === 0) return "aspect-[3/4]";
  if (n === 1) return "aspect-square";
  return "aspect-[4/5]";
}

/** Masonry card for an outfit item on the outfit board (links to item detail). */
export function BoardItemCard({
  imageUrl,
  title,
  price_cents,
  currency = "USD",
  outfitSlug,
  itemId,
  garmentCategory,
  displayLabel,
}: {
  imageUrl: string;
  title: string;
  price_cents: number | null;
  currency?: string;
  outfitSlug: string;
  itemId: string;
  garmentCategory: string;
  displayLabel: string;
}) {
  const aspect = aspectClassForItemId(itemId);
  const badgeText =
    garmentCategory && garmentCategory !== "none" && isGarmentCategory(garmentCategory)
      ? GARMENT_CATEGORY_LABELS[garmentCategory]
      : displayLabel?.trim() || "Item";
  const showSizingHint =
    Boolean(garmentCategory && garmentCategory !== "none" && isGarmentCategory(garmentCategory));

  return (
    <div className="masonry-item">
      <Link href={`/outfits/${outfitSlug}/${itemId}`} className="group block">
        <article className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card transition-all duration-500 hover:shadow-card-hover">
          <div className={`relative w-full overflow-hidden bg-surface-container ${aspect}`}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <span className="absolute right-4 top-4 bg-surface-bright/80 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-primary backdrop-blur-md rounded-lg">
              {badgeText}
            </span>
          </div>
          <div className="p-6">
            <h2 className="font-headline text-xl text-on-surface transition-colors group-hover:text-primary">
              {title}
            </h2>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="font-body text-sm text-primary">
                {price_cents != null ? formatPrice(price_cents, currency) : "—"}
              </span>
              {showSizingHint ? (
                <Icon name="straighten" className="text-on-surface-variant text-xl" />
              ) : (
                <Icon name="bookmark" className="text-on-surface-variant text-xl" />
              )}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}
