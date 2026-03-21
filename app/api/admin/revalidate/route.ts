import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-guards";

const schema = z.object({
  paths: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { paths, tags } = parsed.data;
  if (paths?.length) {
    for (const p of paths) revalidatePath(p);
  }
  if (tags?.length) {
    for (const t of tags) revalidateTag(t);
  }
  revalidatePath("/");
  revalidatePath("/outfits");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true });
}
