import { count, eq } from "drizzle-orm";
import { db, outfits } from "@/lib/db";

export async function DashboardStats() {
  const [total, published, draft] = await Promise.all([
    db.select({ n: count() }).from(outfits),
    db.select({ n: count() }).from(outfits).where(eq(outfits.status, "published")),
    db.select({ n: count() }).from(outfits).where(eq(outfits.status, "draft")),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-sm text-neutral-500">Total outfits</p>
        <p className="mt-1 text-2xl font-semibold">{Number(total[0]?.n ?? 0)}</p>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-sm text-neutral-500">Published</p>
        <p className="mt-1 text-2xl font-semibold text-emerald-700">{Number(published[0]?.n ?? 0)}</p>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-sm text-neutral-500">Drafts</p>
        <p className="mt-1 text-2xl font-semibold text-amber-700">{Number(draft[0]?.n ?? 0)}</p>
      </div>
    </div>
  );
}
