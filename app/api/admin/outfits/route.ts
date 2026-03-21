import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-guards";
import { db, outfits } from "@/lib/db";
import {
  bulkSetOutfitCategory,
  deleteOutfitsByIds,
  listAllOutfitsForAdmin,
  nextUniqueOutfitSlug,
  syncOutfitCategories,
  syncOutfitTags,
} from "@/lib/outfit-mutations";
import { createOutfitSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") as "draft" | "published" | null;
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const rows = await listAllOutfitsForAdmin({
    status: status ?? undefined,
    search,
    categoryId,
  });
  return NextResponse.json({ outfits: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json();
  const parsed = createOutfitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const slug = await nextUniqueOutfitSlug(data.title);

  const now = new Date();
  const publishedAt =
    data.status === "published" ? now : null;

  const [row] = await db
    .insert(outfits)
    .values({
      title: data.title,
      slug,
      description: data.description,
      mainImageUrl: data.mainImageUrl ?? "",
      status: data.status,
      featured: data.featured,
      season: data.season ?? null,
      occasion: data.occasion ?? null,
      sortOrder: data.sortOrder,
      publishedAt,
      updatedAt: now,
    })
    .returning();

  await syncOutfitCategories(row.id, data.categoryIds);
  await syncOutfitTags(row.id, data.tagIds);

  return NextResponse.json({ outfit: row });
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const ids = json?.ids as string[] | undefined;
  if (!ids?.length) {
    return NextResponse.json({ error: "ids required" }, { status: 400 });
  }
  await deleteOutfitsByIds(ids);
  revalidatePath("/");
  revalidatePath("/outfits");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true });
}

/** Bulk: { operation: "setCategory", outfitIds: string[], categoryId: string } */
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (body?.operation === "setCategory" && body.categoryId && Array.isArray(body.outfitIds)) {
    await bulkSetOutfitCategory(body.outfitIds, body.categoryId);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Invalid body" }, { status: 400 });
}
