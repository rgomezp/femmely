import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-guards";
import { categories, db } from "@/lib/db";
import { ensureCategorySlugUnique } from "@/lib/outfit-mutations";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional().default(""),
  coverImageUrl: z.string().url().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().uuid(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  return NextResponse.json({ categories: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const slug = await ensureCategorySlugUnique(d.name);
  const [row] = await db
    .insert(categories)
    .values({
      name: d.name,
      slug,
      description: d.description ?? "",
      coverImageUrl: d.coverImageUrl ?? null,
      sortOrder: d.sortOrder,
    })
    .returning();
  return NextResponse.json({ category: row });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, ...rest } = parsed.data;
  let slug: string | undefined;
  if (rest.name) {
    slug = await ensureCategorySlugUnique(rest.name, id);
  }
  const [row] = await db
    .update(categories)
    .set({
      ...("name" in rest && rest.name !== undefined ? { name: rest.name } : {}),
      ...("description" in rest && rest.description !== undefined ? { description: rest.description } : {}),
      ...("coverImageUrl" in rest && rest.coverImageUrl !== undefined
        ? { coverImageUrl: rest.coverImageUrl }
        : {}),
      ...("sortOrder" in rest && rest.sortOrder !== undefined ? { sortOrder: rest.sortOrder } : {}),
      ...(slug ? { slug } : {}),
    })
    .where(eq(categories.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category: row });
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(categories).where(eq(categories.id, id));
  return NextResponse.json({ ok: true });
}
