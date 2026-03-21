import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/api-guards";
import { db, outfitItems, outfits } from "@/lib/db";
import { outfitItemInputSchema } from "@/lib/validators";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: outfitId } = await ctx.params;
  const parent = await db.select().from(outfits).where(eq(outfits.id, outfitId)).limit(1);
  if (!parent[0]) return NextResponse.json({ error: "Outfit not found" }, { status: 404 });
  const items = await db
    .select()
    .from(outfitItems)
    .where(eq(outfitItems.outfitId, outfitId))
    .orderBy(asc(outfitItems.sortOrder));
  return NextResponse.json({ items });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: outfitId } = await ctx.params;
  const parent = await db.select().from(outfits).where(eq(outfits.id, outfitId)).limit(1);
  if (!parent[0]) return NextResponse.json({ error: "Outfit not found" }, { status: 404 });

  const json = await req.json();
  const parsed = outfitItemInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const [row] = await db
    .insert(outfitItems)
    .values({
      outfitId,
      asin: d.asin,
      title: d.title,
      affiliateUrl: d.affiliateUrl,
      imageUrl: d.imageUrl,
      priceCents: d.priceCents ?? null,
      currency: d.currency,
      displayLabel: d.displayLabel,
      garmentCategory: d.garmentCategory,
      sortOrder: d.sortOrder,
    })
    .returning();
  return NextResponse.json({ item: row });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: outfitId } = await ctx.params;
  const json = await req.json();
  const itemId = json?.itemId as string | undefined;
  if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

  const parsed = outfitItemInputSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await db
    .select()
    .from(outfitItems)
    .where(eq(outfitItems.id, itemId))
    .limit(1);
  if (!existing[0] || existing[0].outfitId !== outfitId) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const [row] = await db
    .update(outfitItems)
    .set({
      ...(data.asin !== undefined ? { asin: data.asin } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.affiliateUrl !== undefined ? { affiliateUrl: data.affiliateUrl } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      ...(data.priceCents !== undefined ? { priceCents: data.priceCents } : {}),
      ...(data.currency !== undefined ? { currency: data.currency } : {}),
      ...(data.displayLabel !== undefined ? { displayLabel: data.displayLabel } : {}),
      ...(data.garmentCategory !== undefined ? { garmentCategory: data.garmentCategory } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    })
    .where(eq(outfitItems.id, itemId))
    .returning();
  return NextResponse.json({ item: row });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id: outfitId } = await ctx.params;
  const itemId = req.nextUrl.searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "itemId query required" }, { status: 400 });
  const existing = await db
    .select()
    .from(outfitItems)
    .where(eq(outfitItems.id, itemId))
    .limit(1);
  if (!existing[0] || existing[0].outfitId !== outfitId) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  await db.delete(outfitItems).where(eq(outfitItems.id, itemId));
  return NextResponse.json({ ok: true });
}
