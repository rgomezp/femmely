import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api-guards";
import { db, outfits } from "@/lib/db";
import {
  deleteOutfitsByIds,
  nextUniqueOutfitSlug,
  syncOutfitCategories,
  syncOutfitTags,
} from "@/lib/outfit-mutations";
import { isVercelBlobUrl } from "@/lib/vercel-blob-delete";
import { updateOutfitSchema } from "@/lib/validators";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const row = await db.select().from(outfits).where(eq(outfits.id, id)).limit(1);
  if (!row[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ outfit: row[0] });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const existing = await db.select().from(outfits).where(eq(outfits.id, id)).limit(1);
  if (!existing[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const json = await req.json();
  const parsed = updateOutfitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  let slug = existing[0].slug;
  if (data.title != null && data.title !== existing[0].title) {
    slug = await nextUniqueOutfitSlug(data.title, id);
  }

  let publishedAt = existing[0].publishedAt;
  if (data.status === "published" && existing[0].status !== "published" && !publishedAt) {
    publishedAt = new Date();
  }

  if (
    data.mainImageUrl !== undefined &&
    data.mainImageUrl !== existing[0].mainImageUrl
  ) {
    const oldUrl = existing[0].mainImageUrl;
    if (oldUrl && isVercelBlobUrl(oldUrl) && oldUrl !== data.mainImageUrl) {
      const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
      if (token) await del(oldUrl, { token }).catch(() => {});
    }
  }

  const [updated] = await db
    .update(outfits)
    .set({
      slug,
      updatedAt: new Date(),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.mainImageUrl !== undefined ? { mainImageUrl: data.mainImageUrl } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      ...(data.season !== undefined ? { season: data.season } : {}),
      ...(data.occasion !== undefined ? { occasion: data.occasion } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      ...(publishedAt !== existing[0].publishedAt ? { publishedAt } : {}),
    })
    .where(eq(outfits.id, id))
    .returning();

  if (data.categoryIds) await syncOutfitCategories(id, data.categoryIds);
  if (data.tagIds) await syncOutfitTags(id, data.tagIds);

  return NextResponse.json({ outfit: updated });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const existing = await db.select({ id: outfits.id }).from(outfits).where(eq(outfits.id, id)).limit(1);
  if (!existing[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteOutfitsByIds([id]);
  revalidatePath("/");
  revalidatePath("/outfits");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true });
}
