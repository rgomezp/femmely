import { NextResponse } from "next/server";
import { getPublishedOutfitItemBySlugAndId } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string; itemId: string }> },
) {
  const { slug, itemId } = await ctx.params;
  const row = await getPublishedOutfitItemBySlugAndId(slug, itemId);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ outfit: row.outfit, item: row.item });
}
