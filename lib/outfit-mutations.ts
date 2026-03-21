import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  categories,
  outfitCategories,
  outfits,
  outfitTags,
  tags,
} from "@/lib/db/schema";
import { deleteOutfitMainImageBlobsForOutfitIds } from "@/lib/vercel-blob-delete";
import { slugifyTitle } from "@/lib/utils";

export async function nextUniqueOutfitSlug(title: string, excludeId?: string) {
  const base = slugifyTitle(title) || "outfit";
  for (let i = 0; i < 100; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const existing = await db
      .select({ id: outfits.id })
      .from(outfits)
      .where(eq(outfits.slug, candidate))
      .limit(1);
    if (!existing[0] || existing[0].id === excludeId) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export async function syncOutfitCategories(outfitId: string, categoryIds: string[]) {
  await db.delete(outfitCategories).where(eq(outfitCategories.outfitId, outfitId));
  if (categoryIds.length === 0) return;
  await db.insert(outfitCategories).values(
    categoryIds.map((categoryId) => ({ outfitId, categoryId })),
  );
}

export async function syncOutfitTags(outfitId: string, tagIds: string[]) {
  await db.delete(outfitTags).where(eq(outfitTags.outfitId, outfitId));
  if (tagIds.length === 0) return;
  await db.insert(outfitTags).values(tagIds.map((tagId) => ({ outfitId, tagId })));
}

export async function listAllOutfitsForAdmin(filters?: {
  status?: "draft" | "published";
  search?: string;
  categoryId?: string;
}) {
  let q = db.select().from(outfits).orderBy(desc(outfits.updatedAt)).$dynamic();

  const conds = [];
  if (filters?.status) conds.push(eq(outfits.status, filters.status));
  if (filters?.search?.trim()) {
    const term = `%${filters.search.trim()}%`;
    conds.push(or(ilike(outfits.title, term), ilike(outfits.slug, term))!);
  }

  if (conds.length) q = q.where(and(...conds));

  let rows = await q;

  if (filters?.categoryId) {
    const links = await db
      .select({ outfitId: outfitCategories.outfitId })
      .from(outfitCategories)
      .where(eq(outfitCategories.categoryId, filters.categoryId));
    const allowed = new Set(links.map((l) => l.outfitId));
    rows = rows.filter((r) => allowed.has(r.id));
  }

  return rows;
}

export async function deleteOutfitsByIds(ids: string[]) {
  if (ids.length === 0) return;
  await deleteOutfitMainImageBlobsForOutfitIds(ids);
  await db.delete(outfits).where(inArray(outfits.id, ids));
}

export async function bulkSetOutfitCategory(outfitIds: string[], categoryId: string) {
  if (outfitIds.length === 0) return;
  await db.transaction(async (tx) => {
    for (const outfitId of outfitIds) {
      await tx.delete(outfitCategories).where(eq(outfitCategories.outfitId, outfitId));
      await tx.insert(outfitCategories).values({ outfitId, categoryId });
    }
  });
}

export async function ensureCategorySlugUnique(name: string, excludeId?: string) {
  const base = slugifyTitle(name) || "category";
  for (let i = 0; i < 100; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, candidate))
      .limit(1);
    if (!existing[0] || existing[0].id === excludeId) return candidate;
  }
  return `${base}-${Date.now()}`;
}

export async function ensureTagSlugUnique(name: string, excludeId?: string) {
  const base = slugifyTitle(name) || "tag";
  for (let i = 0; i < 100; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const existing = await db
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.slug, candidate))
      .limit(1);
    if (!existing[0] || existing[0].id === excludeId) return candidate;
  }
  return `${base}-${Date.now()}`;
}
