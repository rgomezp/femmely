import { and, asc, count, desc, eq, ilike, inArray, ne, or } from "drizzle-orm";
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

/** First linked category name per outfit (by category sort order, then name). */
export async function firstCategoryNameByOutfitIds(outfitIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (outfitIds.length === 0) return map;
  const rows = await db
    .select({
      outfitId: outfitCategories.outfitId,
      name: categories.name,
      sortOrder: categories.sortOrder,
    })
    .from(outfitCategories)
    .innerJoin(categories, eq(outfitCategories.categoryId, categories.id))
    .where(inArray(outfitCategories.outfitId, outfitIds))
    .orderBy(asc(outfitCategories.outfitId), asc(categories.sortOrder), asc(categories.name));
  for (const r of rows) {
    if (!map.has(r.outfitId)) map.set(r.outfitId, r.name);
  }
  return map;
}

/** First outfit item image URL per outfit (by sortOrder, then createdAt). */
export async function firstItemImageUrlByOutfitIds(outfitIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (outfitIds.length === 0) return map;
  const rows = await db
    .select({
      outfitId: outfitItems.outfitId,
      imageUrl: outfitItems.imageUrl,
    })
    .from(outfitItems)
    .where(inArray(outfitItems.outfitId, outfitIds))
    .orderBy(asc(outfitItems.outfitId), asc(outfitItems.sortOrder), asc(outfitItems.createdAt));
  for (const r of rows) {
    if (!map.has(r.outfitId)) map.set(r.outfitId, r.imageUrl);
  }
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
  /** When set, only these published outfits (intersects with category/tag filters). */
  ids?: string[];
  /** Only outfits marked featured in admin. */
  featuredOnly?: boolean;
  /** Exclude one outfit (e.g. current page). */
  excludeOutfitId?: string;
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

  if (options?.ids?.length) {
    const parsed = [...new Set(options.ids.map((id) => id.trim()).filter(Boolean))];
    if (parsed.length === 0) return [];
    outfitIds = outfitIds ? outfitIds.filter((id) => parsed.includes(id)) : parsed;
    if (outfitIds.length === 0) return [];
  }

  const conds = [eq(outfits.status, "published")];
  if (outfitIds) conds.push(inArray(outfits.id, outfitIds));
  if (options?.season) conds.push(eq(outfits.season, options.season));
  if (options?.occasion) conds.push(eq(outfits.occasion, options.occasion));
  if (options?.featuredOnly) conds.push(eq(outfits.featured, true));
  if (options?.excludeOutfitId) conds.push(ne(outfits.id, options.excludeOutfitId));

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

  if (options?.ids?.length) {
    const orderMap = new Map(options.ids.map((id, i) => [id.trim(), i]));
    withCounts = [...withCounts].sort(
      (a, b) => (orderMap.get(a.outfit.id) ?? 999) - (orderMap.get(b.outfit.id) ?? 999),
    );
  } else if (options?.sort === "items") {
    withCounts = [...withCounts].sort((a, b) => b.itemCount - a.itemCount);
  }

  const page = withCounts.slice(offset, offset + limit);
  const categoryMap = await firstCategoryNameByOutfitIds(page.map((r) => r.outfit.id));
  const firstItemImages =
    options?.ids?.length && page.length > 0
      ? await firstItemImageUrlByOutfitIds(page.map((r) => r.outfit.id))
      : null;

  return page.map((r) => ({
    ...r,
    cardImageUrl:
      r.outfit.mainImageUrl ?? firstItemImages?.get(r.outfit.id) ?? "",
    primaryCategoryName: categoryMap.get(r.outfit.id),
  }));
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

/** Newest published featured outfit; carousel on outfit pages uses `listPublishedOutfits({ featuredOnly: true })`. */
export async function getFeaturedOutfitWithCardImage(): Promise<(Outfit & { cardImageUrl: string }) | null> {
  const row = await getFeaturedOutfit();
  if (!row) return null;
  return { ...row, cardImageUrl: row.mainImageUrl ?? "" };
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

export async function getPublishedOutfitItemBySlugAndId(slug: string, itemId: string) {
  const outfit = await getPublishedOutfitBySlug(slug);
  if (!outfit) return null;
  const row = await db
    .select()
    .from(outfitItems)
    .where(and(eq(outfitItems.outfitId, outfit.id), eq(outfitItems.id, itemId)))
    .limit(1);
  const item = row[0];
  return item ? { outfit, item } : null;
}

export async function getPublishedOutfitItemRoutes(): Promise<{ slug: string; itemId: string }[]> {
  const rows = await db
    .select({ slug: outfits.slug, itemId: outfitItems.id })
    .from(outfitItems)
    .innerJoin(outfits, eq(outfits.id, outfitItems.outfitId))
    .where(eq(outfits.status, "published"));
  return rows.map((r) => ({ slug: r.slug, itemId: r.itemId }));
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

/**
 * Full-text-style search over published outfits: title, description, linked
 * category/tag names, and item titles and labels (e.g. brand-style keywords).
 */
export async function searchPublishedOutfits(q: string, limit = 48) {
  const raw = q.trim();
  if (!raw) return [];
  const term = `%${raw}%`;

  const [direct, byCategory, byTag, byItem] = await Promise.all([
    db
      .select({ id: outfits.id })
      .from(outfits)
      .where(
        and(
          eq(outfits.status, "published"),
          or(ilike(outfits.title, term), ilike(outfits.description, term)),
        ),
      ),
    db
      .select({ id: outfits.id })
      .from(outfits)
      .innerJoin(outfitCategories, eq(outfitCategories.outfitId, outfits.id))
      .innerJoin(categories, eq(categories.id, outfitCategories.categoryId))
      .where(and(eq(outfits.status, "published"), ilike(categories.name, term))),
    db
      .select({ id: outfits.id })
      .from(outfits)
      .innerJoin(outfitTags, eq(outfitTags.outfitId, outfits.id))
      .innerJoin(tags, eq(tags.id, outfitTags.tagId))
      .where(
        and(
          eq(outfits.status, "published"),
          or(ilike(tags.name, term), ilike(tags.slug, term)),
        ),
      ),
    db
      .select({ id: outfits.id })
      .from(outfits)
      .innerJoin(outfitItems, eq(outfitItems.outfitId, outfits.id))
      .where(
        and(
          eq(outfits.status, "published"),
          or(ilike(outfitItems.title, term), ilike(outfitItems.displayLabel, term)),
        ),
      ),
  ]);

  const idSet = new Set<string>();
  for (const r of direct) idSet.add(r.id);
  for (const r of byCategory) idSet.add(r.id);
  for (const r of byTag) idSet.add(r.id);
  for (const r of byItem) idSet.add(r.id);

  if (idSet.size === 0) return [];

  const ids = [...idSet];
  return db
    .select()
    .from(outfits)
    .where(and(eq(outfits.status, "published"), inArray(outfits.id, ids)))
    .orderBy(desc(outfits.publishedAt))
    .limit(limit);
}

export async function outfitsWithItemCounts(outfitList: Outfit[]) {
  const ids = outfitList.map((o) => o.id);
  const map = await itemCountByOutfitIds(ids);
  const categoryMap = await firstCategoryNameByOutfitIds(ids);
  return outfitList.map((outfit) => ({
    outfit,
    itemCount: map.get(outfit.id) ?? 0,
    cardImageUrl: outfit.mainImageUrl ?? "",
    primaryCategoryName: categoryMap.get(outfit.id),
  }));
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
