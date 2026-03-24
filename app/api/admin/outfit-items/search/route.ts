import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-guards";
import { searchAdminOutfitItemsForReuse } from "@/lib/admin-item-search";

const querySchema = z.object({
  q: z.string().min(2).max(200),
  excludeOutfitId: z.string().uuid().optional(),
});

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = req.nextUrl;
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? "",
    excludeOutfitId: searchParams.get("excludeOutfitId") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query (q must be at least 2 characters)." }, { status: 400 });
  }

  const items = await searchAdminOutfitItemsForReuse({
    q: parsed.data.q,
    excludeOutfitId: parsed.data.excludeOutfitId,
  });
  return NextResponse.json({ items });
}
