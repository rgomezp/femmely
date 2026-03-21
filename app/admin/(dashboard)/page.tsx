import Link from "next/link";
import { desc } from "drizzle-orm";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { db, outfits } from "@/lib/db";

export default async function AdminHomePage() {
  const recent = await db.select().from(outfits).orderBy(desc(outfits.updatedAt)).limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-neutral-500">Femmely content overview</p>
      </div>
      <DashboardStats />
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent outfits</h2>
          <Link href="/admin/outfits/new" className="text-sm font-medium text-[#e8485c]">
            New outfit
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {recent.map((o) => (
            <li key={o.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{o.title}</p>
                <p className="text-xs text-neutral-500">
                  {o.status} · {o.slug}
                </p>
              </div>
              <Link href={`/admin/outfits/${o.id}/edit`} className="text-sm text-[#e8485c]">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
