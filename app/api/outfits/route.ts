import { NextRequest, NextResponse } from "next/server";
import { listPublishedOutfits } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const season = searchParams.get("season") ?? undefined;
  const occasion = searchParams.get("occasion") ?? undefined;
  const sort = (searchParams.get("sort") as "newest" | "items" | "title") ?? "newest";
  const limit = Math.min(Number(searchParams.get("limit") ?? 24), 100);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

  const rows = await listPublishedOutfits({
    categorySlug: category,
    tagSlug: tag,
    season,
    occasion,
    sort,
    limit,
    offset,
  });

  return NextResponse.json({
    outfits: rows.map((r) => ({
      ...r.outfit,
      itemCount: r.itemCount,
    })),
  });
}
