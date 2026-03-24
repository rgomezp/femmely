import { and, desc, eq, ilike, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { outfitItems, outfits } from "@/lib/db/schema";

export type AdminCatalogItemRow = {
  id: string;
  outfitId: string;
  asin: string;
  title: string;
  affiliateUrl: string;
  imageUrl: string;
  priceCents: number | null;
  currency: string;
  displayLabel: string;
  garmentCategory: string;
  sourceOutfitTitle: string;
  sourceOutfitSlug: string;
};

/** Search existing outfit_items for admin reuse (copy into another outfit). */
export async function searchAdminOutfitItemsForReuse(options: {
  q: string;
  excludeOutfitId?: string;
  limit?: number;
}): Promise<AdminCatalogItemRow[]> {
  const term = options.q.trim();
  if (term.length < 2) return [];

  const like = `%${term}%`;
  const limit = Math.min(Math.max(options.limit ?? 30, 1), 50);

  const match = or(
    ilike(outfitItems.title, like),
    ilike(outfitItems.displayLabel, like),
    ilike(outfitItems.asin, like),
  )!;

  const conds = [match];
  if (options.excludeOutfitId) {
    conds.push(ne(outfitItems.outfitId, options.excludeOutfitId));
  }

  const rows = await db
    .select({
      id: outfitItems.id,
      outfitId: outfitItems.outfitId,
      asin: outfitItems.asin,
      title: outfitItems.title,
      affiliateUrl: outfitItems.affiliateUrl,
      imageUrl: outfitItems.imageUrl,
      priceCents: outfitItems.priceCents,
      currency: outfitItems.currency,
      displayLabel: outfitItems.displayLabel,
      garmentCategory: outfitItems.garmentCategory,
      sourceOutfitTitle: outfits.title,
      sourceOutfitSlug: outfits.slug,
    })
    .from(outfitItems)
    .innerJoin(outfits, eq(outfits.id, outfitItems.outfitId))
    .where(and(...conds))
    .orderBy(desc(outfits.updatedAt), desc(outfitItems.createdAt))
    .limit(limit);

  return rows;
}
