"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteOutfitButton({ outfitId, title }: { outfitId: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (
      !confirm(
        `Delete “${title}”? This permanently removes the outfit, its items, and board photos stored in Vercel Blob.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/outfits/${outfitId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/outfits");
      router.refresh();
    } catch {
      alert("Could not delete outfit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6">
      <h2 className="font-semibold text-red-900">Danger zone</h2>
      <p className="mt-2 text-sm text-red-800/90">
        Deleting removes this outfit from the database and deletes the main outfit image from Blob if it was stored
        there. Amazon product images are not removed (they are hosted by Amazon).
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onDelete}
        className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        {busy ? "Deleting…" : "Delete outfit"}
      </button>
    </div>
  );
}
