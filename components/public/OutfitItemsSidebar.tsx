import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { ItemDisplay } from "./ItemCard";

/** Right-column list of outfit items using Amazon product imagery. */
export function OutfitItemsSidebar({
  outfitSlug,
  items,
}: {
  outfitSlug: string;
  items: ItemDisplay[];
}) {
  if (items.length === 0) return null;

  return (
    <aside className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-card lg:sticky lg:top-32 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <h2 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Shop the look</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/outfits/${outfitSlug}/${item.id}`}
              className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-surface-container-low"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt="" fill className="object-contain" sizes="80px" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-body text-sm font-medium leading-snug text-on-surface group-hover:text-primary">
                  {item.title}
                </p>
                <p className="mt-1 font-body text-sm font-semibold text-on-surface">
                  {formatPrice(item.priceCents, item.currency)}
                </p>
                <span className="sr-only">View item details</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
