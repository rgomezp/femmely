import { NextResponse } from "next/server";
import { getOutfitItems, getPublishedOutfitBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const outfit = await getPublishedOutfitBySlug(slug);
  if (!outfit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const items = await getOutfitItems(outfit.id);
  return NextResponse.json({ outfit, items });
}
