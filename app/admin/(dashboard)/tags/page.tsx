import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, tags } from "@/lib/db";
import { ensureTagSlugUnique } from "@/lib/outfit-mutations";

async function createTag(formData: FormData) {
  "use server";
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  const slug = await ensureTagSlugUnique(name);
  await db.insert(tags).values({ name, slug });
  revalidatePath("/admin/tags");
  revalidatePath("/");
}

async function deleteTag(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await db.delete(tags).where(eq(tags.id, id));
  revalidatePath("/admin/tags");
  revalidatePath("/");
}

export default async function AdminTagsPage() {
  const rows = await db.select().from(tags).orderBy(asc(tags.name));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tags</h1>
      <form action={createTag} className="flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-white p-4">
        <input name="name" placeholder="New tag" className="flex-1 rounded-xl border px-3 py-2" required />
        <button type="submit" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white">
          Add
        </button>
      </form>
      <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {rows.map((t) => (
          <li key={t.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-neutral-500">{t.slug}</p>
            </div>
            <form action={deleteTag}>
              <input type="hidden" name="id" value={t.id} />
              <button type="submit" className="text-red-600">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
