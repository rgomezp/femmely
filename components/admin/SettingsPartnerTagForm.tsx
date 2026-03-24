"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SettingsPartnerTagForm({
  envDefault,
  initialEffective,
}: {
  envDefault: string;
  initialEffective: string;
}) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState(initialEffective);
  const [bulkRetag, setBulkRetag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const trimmed = tagInput.trim();
    const env = envDefault.trim();
    const bodyOverride = trimmed === env ? null : trimmed;

    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amazonPartnerTagOverride: bodyOverride,
          bulkRetagAffiliateUrls: bulkRetag,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { error?: unknown; effective?: string; bulkRetagged?: boolean }
        | null;
      if (!res.ok) {
        const err = data?.error;
        setError(
          typeof err === "string"
            ? err
            : err && typeof err === "object"
              ? "Invalid request."
              : "Save failed.",
        );
        return;
      }
      setMessage(
        data?.bulkRetagged
          ? "Saved. All product affiliate links were rewritten to use the effective tag."
          : "Saved.",
      );
      setBulkRetag(false);
      if (typeof data?.effective === "string") setTagInput(data.effective);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Amazon Associates partner tag</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Value passed as the <code className="rounded bg-neutral-100 px-1">tag</code> query parameter on product
          links. If you do not set a database override,{" "}
          <span className="font-mono text-neutral-800">AMAZON_PARTNER_TAG</span> from the environment is used. Saving
          a value that matches the environment clears the override and keeps the database row aligned with env.
        </p>
      </div>
      <div>
        <label htmlFor="partner-tag" className="block text-sm font-medium text-neutral-800">
          Effective partner tag
        </label>
        <input
          id="partner-tag"
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          maxLength={64}
          autoComplete="off"
          className="mt-1 w-full max-w-md rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-normal text-neutral-900 placeholder:text-neutral-400"
          placeholder={envDefault || "(none from environment)"}
        />
        <p className="mt-1 text-xs text-neutral-500">
          Environment default:{" "}
          <span className="font-mono text-neutral-700">{envDefault ? envDefault : "(not set)"}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          className="text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900 disabled:opacity-50"
          onClick={() => setTagInput(envDefault)}
        >
          Reset field to environment default
        </button>
      </div>
      <label className="flex max-w-xl cursor-pointer items-start gap-2 text-sm text-neutral-800">
        <input
          type="checkbox"
          checked={bulkRetag}
          disabled={busy}
          onChange={(e) => setBulkRetag(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          After saving, rewrite <strong>all</strong> saved product affiliate URLs in the database to use the effective
          tag (marketplace per row is preserved). Use this when you change the tag so existing links stay credited.
        </span>
      </label>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-[#e8485c] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save partner tag"}
      </button>
    </form>
  );
}
