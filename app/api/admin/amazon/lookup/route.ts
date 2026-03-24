import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-guards";
import { amazonConfigured, fetchAmazonItem } from "@/lib/amazon";

const bodySchema = z.object({ asin: z.string().min(10).max(20) });

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!amazonConfigured()) {
    return NextResponse.json(
      { error: "Amazon Creators API is not configured in environment variables." },
      { status: 503 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ASIN" }, { status: 400 });
  }

  try {
    const product = await fetchAmazonItem(parsed.data.asin.trim().toUpperCase());
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Creators API error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
