import { and, asc, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  categories,
  outfitCategories,
  outfitItems,
  outfits,
  outfitTags,
  tags,
  type Outfit,
} from "@/lib/db/schema";

export async function getPublishedOutfitSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: outfits.slug })
    .from(outfits)
    .where(eq(outfits.status, "published"));
  return rows.map((r) => r.slug);
}

export async function getCategorySlugs(): Promise<string[]> {
  const rows = await db.select({ slug: categories.slug }).from(categories);
  return rows.map((r) => r.slug);
}

export async function getTagSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: tags.slug }).from(tags);
  return rows.map((r) => r.slug);
}

export async function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function listTags() {
  return db.select().from(tags).orderBy(asc(tags.name));
}

export async function itemCountByOutfitIds(ids: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (ids.length === 0) return map;
  const rows = await db
    .select({ outfitId: outfitItems.outfitId, n: count() })
    .from(outfitItems)
    .where(inArray(outfitItems.outfitId, ids))
    .groupBy(outfitItems.outfitId);
  for (const r of rows) map.set(r.outfitId, Number(r.n));
  return map;
}

export async function listPublishedOutfits(options?: {
  categorySlug?: string;
  tagSlug?: string;
  season?: string;
  occasion?: string;
  sort?: "newest" | "items" | "title";
  limit?: number;
  offset?: number;
}) {
  const limit = options?.limit ?? 24;
  const offset = options?.offset ?? 0;

  let outfitIds: string[] | null = null;

  if (options?.categorySlug) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, options.categorySlug))
      .limit(1);
    if (!cat[0]) return [];
    const links = await db
      .select({ outfitId: outfitCategories.outfitId })
      .from(outfitCategories)
      .where(eq(outfitCategories.categoryId, cat[0].id));
    outfitIds = links.map((l) => l.outfitId);
    if (outfitIds.length === 0) return [];
  }

  if (options?.tagSlug) {
    const tg = await db.select({ id: tags.id }).from(tags).where(eq(tags.slug, options.tagSlug)).limit(1);
    if (!tg[0]) return [];
    const links = await db
      .select({ outfitId: outfitTags.outfitId })
      .from(outfitTags)
      .where(eq(outfitTags.tagId, tg[0].id));
    const tagOutfitIds = links.map((l) => l.outfitId);
    outfitIds = outfitIds
      ? outfitIds.filter((id) => tagOutfitIds.includes(id))
      : tagOutfitIds;
    if (outfitIds.length === 0) return [];
  }

  const conds = [eq(outfits.status, "published")];
  if (outfitIds) conds.push(inArray(outfits.id, outfitIds));
  if (options?.season) conds.push(eq(outfits.season, options.season));
  if (options?.occasion) conds.push(eq(outfits.occasion, options.occasion));

  const whereClause = and(...conds);

  let orderByClause;
  if (options?.sort === "title") {
    orderByClause = [asc(outfits.title)];
  } else if (options?.sort === "newest") {
    orderByClause = [desc(outfits.publishedAt), desc(outfits.createdAt)];
  } else {
    orderByClause = [desc(outfits.publishedAt), desc(outfits.createdAt)];
  }

  const outfitRows = await db
    .select()
    .from(outfits)
    .where(whereClause)
    .orderBy(...orderByClause);

  const countMap = await itemCountByOutfitIds(outfitRows.map((o) => o.id));

  let withCounts = outfitRows.map((outfit) => ({
    outfit,
    itemCount: countMap.get(outfit.id) ?? 0,
  }));

  if (options?.sort === "items") {
    withCounts = [...withCounts].sort((a, b) => b.itemCount - a.itemCount);
  }

  return withCounts.slice(offset, offset + limit);
}

export async function getFeaturedOutfit() {
  const row = await db
    .select()
    .from(outfits)
    .where(and(eq(outfits.status, "published"), eq(outfits.featured, true)))
    .orderBy(desc(outfits.publishedAt))
    .limit(1);
  return row[0] ?? null;
}

export async function getOutfitBySlug(slug: string) {
  const row = await db.select().from(outfits).where(eq(outfits.slug, slug)).limit(1);
  return row[0] ?? null;
}

export async function getPublishedOutfitBySlug(slug: string) {
  const row = await db
    .select()
    .from(outfits)
    .where(and(eq(outfits.slug, slug), eq(outfits.status, "published")))
    .limit(1);
  return row[0] ?? null;
}

export async function getOutfitItems(outfitId: string) {
  return db
    .select()
    .from(outfitItems)
    .where(eq(outfitItems.outfitId, outfitId))
    .orderBy(asc(outfitItems.sortOrder), asc(outfitItems.createdAt));
}

export async function getOutfitCategories(outfitId: string) {
  return db
    .select({ category: categories })
    .from(outfitCategories)
    .innerJoin(categories, eq(categories.id, outfitCategories.categoryId))
    .where(eq(outfitCategories.outfitId, outfitId));
}

export async function getOutfitTags(outfitId: string) {
  return db
    .select({ tag: tags })
    .from(outfitTags)
    .innerJoin(tags, eq(tags.id, outfitTags.tagId))
    .where(eq(outfitTags.outfitId, outfitId));
}

export async function getOutfitCategoryIds(outfitId: string): Promise<string[]> {
  const rows = await db
    .select({ id: outfitCategories.categoryId })
    .from(outfitCategories)
    .where(eq(outfitCategories.outfitId, outfitId));
  return rows.map((r) => r.id);
}

export async function getOutfitTagIds(outfitId: string): Promise<string[]> {
  const rows = await db
    .select({ id: outfitTags.tagId })
    .from(outfitTags)
    .where(eq(outfitTags.outfitId, outfitId));
  return rows.map((r) => r.id);
}

export async function searchPublishedOutfits(q: string, limit = 20) {
  const term = `%${q.trim()}%`;
  if (!q.trim()) return [];
  return db
    .select()
    .from(outfits)
    .where(
      and(
        eq(outfits.status, "published"),
        or(ilike(outfits.title, term), ilike(outfits.description, term)),
      ),
    )
    .orderBy(desc(outfits.publishedAt))
    .limit(limit);
}

export async function outfitsWithItemCounts(outfitList: Outfit[]) {
  const ids = outfitList.map((o) => o.id);
  const map = await itemCountByOutfitIds(ids);
  return outfitList.map((outfit) => ({ outfit, itemCount: map.get(outfit.id) ?? 0 }));
}

export async function getRelatedOutfits(outfitId: string, categoryIds: string[], tagIds: string[], limit = 6) {
  const relatedFromCats =
    categoryIds.length > 0
      ? await db
          .select({ outfitId: outfitCategories.outfitId })
          .from(outfitCategories)
          .where(inArray(outfitCategories.categoryId, categoryIds))
      : [];

  const relatedFromTags =
    tagIds.length > 0
      ? await db
          .select({ outfitId: outfitTags.outfitId })
          .from(outfitTags)
          .where(inArray(outfitTags.tagId, tagIds))
      : [];

  const candidates = new Set<string>();
  for (const r of relatedFromCats) {
    if (r.outfitId !== outfitId) candidates.add(r.outfitId);
  }
  for (const r of relatedFromTags) {
    if (r.outfitId !== outfitId) candidates.add(r.outfitId);
  }

  const ids = [...candidates].slice(0, limit + 5);
  if (ids.length === 0) return [];

  return db
    .select()
    .from(outfits)
    .where(and(eq(outfits.status, "published"), inArray(outfits.id, ids)))
    .orderBy(desc(outfits.publishedAt))
    .limit(limit);
}
