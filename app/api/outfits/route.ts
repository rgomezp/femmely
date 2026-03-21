import { NextRequest, NextResponse } from "next/server";
import { listPublishedOutfits } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const season = searchParams.get("season") ?? undefined;
  const occasion = searchParams.get("occasion") ?? undefined;
  const sort = (searchParams.get("sort") as "newest" | "items" | "title") ?? "newest";
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

  const idsParam = searchParams.get("ids");
  const idsRaw = idsParam
    ? [...new Set(idsParam.split(",").map((s) => s.trim()).filter(Boolean))]
    : [];
  const ids = idsRaw.filter((id) => UUID_RE.test(id));

  if (idsParam !== null && idsParam.trim() !== "" && ids.length === 0) {
    return NextResponse.json({ outfits: [] });
  }

  let limit = Math.min(Number(searchParams.get("limit") ?? 24), 100);
  if (ids.length > 0) {
    limit = Math.min(Math.max(limit, ids.length), 100);
  }

  const rows = await listPublishedOutfits({
    categorySlug: category,
    tagSlug: tag,
    season,
    occasion,
    sort,
    limit,
    offset,
    ids: ids.length > 0 ? ids : undefined,
  });

  return NextResponse.json({
    outfits: rows.map((r) => ({
      ...r.outfit,
      itemCount: r.itemCount,
      cardImageUrl: r.cardImageUrl,
      primaryCategoryName: r.primaryCategoryName,
    })),
  });
}
