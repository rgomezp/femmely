import Link from "next/link";
import { listAllOutfitsForAdmin } from "@/lib/outfit-mutations";
import { OutfitBulkClient } from "./outfit-bulk-client";

export default async function AdminOutfitsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; categoryId?: string }>;
}) {
  const sp = await searchParams;
  const rows = await listAllOutfitsForAdmin({
    status: sp.status as "draft" | "published" | undefined,
    search: sp.search,
    categoryId: sp.categoryId,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Outfits</h1>
        <Link
          href="/admin/outfits/new"
          className="rounded-xl bg-[#e8485c] px-4 py-2 text-sm font-semibold text-white"
        >
          New outfit
        </Link>
      </div>
      <form className="flex flex-wrap items-center gap-2 text-sm" action="/admin/outfits" method="get">
        <input
          name="search"
          placeholder="Search title…"
          defaultValue={sp.search}
          className="min-w-[12rem] rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-normal text-neutral-800 placeholder:text-neutral-400"
        />
        <select
          name="status"
          defaultValue={sp.status ?? ""}
          className="min-w-[12rem] cursor-pointer rounded-xl border border-neutral-200 bg-white py-2 pl-3 pr-10 text-sm font-normal text-neutral-800"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
        >
          Filter
        </button>
      </form>
      <OutfitBulkClient outfits={rows} />
    </div>
  );
}
