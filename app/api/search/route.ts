import { NextRequest, NextResponse } from "next/server";
import { searchPublishedOutfits } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 20), 50);
  const results = await searchPublishedOutfits(q, limit);
  return NextResponse.json({ outfits: results });
}
