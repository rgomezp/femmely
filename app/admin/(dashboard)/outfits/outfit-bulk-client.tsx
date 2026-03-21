"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FeaturedTooltipHint } from "@/components/admin/FeaturedTooltipHint";
import type { Outfit } from "@/lib/db/schema";

const actionClass =
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function OutfitBulkClient({ outfits }: { outfits: Outfit[] }) {
  const router = useRouter();
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  function toggle(id: string) {
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function bulkDelete() {
    if (sel.size === 0) return;
    if (!confirm(`Delete ${sel.size} outfit(s)? Board photos in Blob will be removed.`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/outfits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...sel] }),
      });
      if (!res.ok) throw new Error();
      setSel(new Set());
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteOne(id: string, title: string) {
    if (!confirm(`Delete “${title}”? This removes the outfit and any board photos stored in Blob.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/outfits/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSel((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function quickPut(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/outfits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy || sel.size === 0}
          onClick={bulkDelete}
          className="cursor-pointer rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete selected ({sel.size})
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm text-neutral-800">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="p-3 w-10" />
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  Featured
                  <FeaturedTooltipHint />
                </span>
              </th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {outfits.map((o) => (
              <tr key={o.id} className="border-b border-neutral-100">
                <td className="p-3">
                  <input type="checkbox" checked={sel.has(o.id)} onChange={() => toggle(o.id)} />
                </td>
                <td className="p-3 font-medium">{o.title}</td>
                <td className="p-3 font-normal capitalize">{o.status}</td>
                <td className="p-3 font-normal">{o.featured ? "Yes" : "—"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={`/admin/outfits/${o.id}/edit`}
                      className={`${actionClass} border-blue-200 bg-white text-blue-800 hover:bg-blue-50`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      className={`${actionClass} border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50`}
                      onClick={() =>
                        quickPut(o.id, { status: o.status === "published" ? "draft" : "published" })
                      }
                    >
                      {o.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className={`${actionClass} border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50`}
                      onClick={() => quickPut(o.id, { featured: !o.featured })}
                    >
                      Toggle feature
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className={`${actionClass} border-red-200 bg-red-50 text-red-900 hover:bg-red-100`}
                      onClick={() => deleteOne(o.id, o.title)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
