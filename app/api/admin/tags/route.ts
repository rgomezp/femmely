import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-guards";
import { db, tags } from "@/lib/db";
import { ensureTagSlugUnique } from "@/lib/outfit-mutations";

const createSchema = z.object({
  name: z.string().min(1).max(100),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const rows = await db.select().from(tags).orderBy(asc(tags.name));
  return NextResponse.json({ tags: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const slug = await ensureTagSlugUnique(parsed.data.name);
  const [row] = await db
    .insert(tags)
    .values({ name: parsed.data.name, slug })
    .returning();
  return NextResponse.json({ tag: row });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, name } = parsed.data;
  let slug: string | undefined;
  if (name) slug = await ensureTagSlugUnique(name, id);
  const [row] = await db
    .update(tags)
    .set({
      ...(name ? { name } : {}),
      ...(slug ? { slug } : {}),
    })
    .where(eq(tags.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ tag: row });
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(tags).where(eq(tags.id, id));
  return NextResponse.json({ ok: true });
}
