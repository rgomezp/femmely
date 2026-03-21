import type { LiveAmazonProduct } from "@/lib/amazon";
import type { OutfitItem } from "@/lib/db/schema";
import type { ItemDisplay } from "@/components/public/ItemCard";

export function mergeItemDisplay(item: OutfitItem, live: LiveAmazonProduct | null): ItemDisplay {
  const amazonImage = live?.imageUrl ?? item.imageUrl;
  return {
    id: item.id,
    title: live?.title ?? item.title,
    imageUrl: amazonImage,
    primaryImageUrl: amazonImage,
    affiliateUrl: live?.affiliateUrl ?? item.affiliateUrl,
    priceCents: live?.priceCents ?? item.priceCents,
    currency: live?.currency ?? item.currency,
    displayLabel: item.displayLabel,
    garmentCategory: item.garmentCategory,
  };
}
