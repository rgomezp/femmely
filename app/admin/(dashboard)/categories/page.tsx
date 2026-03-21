import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { categories, db } from "@/lib/db";
import { ensureCategorySlugUnique } from "@/lib/outfit-mutations";

async function createCategory(formData: FormData) {
  "use server";
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  const slug = await ensureCategorySlugUnique(name);
  await db.insert(categories).values({ name, slug, description: "", sortOrder: 0 });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export default async function AdminCategoriesPage() {
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <form action={createCategory} className="flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-white p-4">
        <input name="name" placeholder="New category name" className="flex-1 rounded-xl border px-3 py-2" required />
        <button type="submit" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white">
          Add
        </button>
      </form>
      <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {rows.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-neutral-500">{c.slug}</p>
            </div>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
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
