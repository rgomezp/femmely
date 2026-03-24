import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { GARMENT_CATEGORY_LABELS, isGarmentCategory } from "@/lib/sizing/types";
import { Icon } from "@/components/ui/Icon";

/** Horizontal row card for an outfit item on the outfit detail page (contrasts with browse masonry cards). */
export function OutfitItemRowCard({
  imageUrl,
  title,
  price_cents,
  currency = "USD",
  outfitSlug,
  itemId,
  garmentCategory,
  displayLabel,
  affiliateUrl,
}: {
  imageUrl: string;
  title: string;
  price_cents: number | null;
  currency?: string;
  outfitSlug: string;
  itemId: string;
  garmentCategory: string;
  displayLabel: string;
  affiliateUrl: string;
}) {
  const badgeText =
    garmentCategory && garmentCategory !== "none" && isGarmentCategory(garmentCategory)
      ? GARMENT_CATEGORY_LABELS[garmentCategory]
      : displayLabel?.trim() || "Item";
  const showSizingHint =
    Boolean(garmentCategory && garmentCategory !== "none" && isGarmentCategory(garmentCategory));

  const sizingHref = `/outfits/${outfitSlug}/${itemId}`;

  return (
    <div className="group flex gap-4 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-3 shadow-card transition-all hover:border-primary/30 hover:shadow-card-hover sm:gap-5 sm:p-4">
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={`Shop on Amazon: ${title}`}
        className="relative aspect-[4/3] w-[8.25rem] shrink-0 overflow-hidden rounded-lg bg-surface-container outline-none ring-offset-2 ring-offset-surface-container-lowest transition-transform focus-visible:ring-2 focus-visible:ring-primary sm:w-[10.5rem]"
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 132px, 168px"
        />
        <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] bg-surface-bright/80 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-primary backdrop-blur-md rounded-lg">
          {badgeText}
        </span>
      </a>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-0.5">
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block min-w-0 rounded-lg outline-none ring-offset-2 ring-offset-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary"
        >
          <h2 className="font-headline text-base leading-snug text-on-surface transition-colors group-hover:text-primary sm:text-lg">
            {title}
          </h2>
          <p className="mt-1 font-body text-sm font-semibold text-primary">
            {price_cents != null ? formatPrice(price_cents, currency) : "—"}
          </p>
        </a>
        {showSizingHint ? (
          <div className="flex justify-end">
            <Link
              href={sizingHref}
              className="inline-flex min-h-11 items-center gap-[10px] rounded-lg px-3 py-2 font-label text-[10px] uppercase tracking-widest text-primary transition-opacity hover:opacity-80 sm:px-4"
            >
              Get my size
              <Icon name="straighten" className="text-xl shrink-0" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
