"use client";

import { useState } from "react";

type Product = {
  asin: string;
  title: string;
  imageUrl: string | null;
  priceCents: number | null;
  currency: string;
  affiliateUrl: string;
  availability: string | null;
};

export function AsinLookup({
  onProduct,
}: {
  onProduct: (p: Product) => void;
}) {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/amazon/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin: asin.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      onProduct(data.product);
      setAsin("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-[200px] flex-1">
        <label className="text-xs font-medium text-neutral-500">ASIN</label>
        <input
          value={asin}
          onChange={(e) => setAsin(e.target.value)}
          placeholder="B0XXXXXXXX"
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 font-mono text-sm uppercase"
        />
      </div>
      <button
        type="button"
        onClick={lookup}
        disabled={loading || !asin.trim()}
        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "…" : "Lookup"}
      </button>
      {error ? <p className="w-full text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
