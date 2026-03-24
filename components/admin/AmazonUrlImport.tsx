"use client";

import { useCallback, useState } from "react";
import { parseAmazonProductInput } from "@/lib/amazon-url";

type Props = {
  partnerTag?: string;
  defaultMarketplaceHost: string;
  onAdd: (row: {
    asin: string;
    affiliateUrl: string;
  }) => void;
};

export function AmazonUrlImport({ partnerTag, defaultMarketplaceHost, onAdd }: Props) {
  const [value, setValue] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  const apply = useCallback(() => {
    setHint(null);
    const result = parseAmazonProductInput(value, {
      partnerTag,
      defaultMarketplaceHost,
    });
    if (!result.ok) {
      setHint(result.error);
      return;
    }
    onAdd({ asin: result.asin, affiliateUrl: result.affiliateUrl });
    setValue("");
  }, [value, partnerTag, defaultMarketplaceHost, onAdd]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const uri = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (uri?.trim()) {
      setValue(uri.trim());
      setHint(null);
    }
  }

  return (
    <div
      className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <p className="text-sm font-medium text-neutral-800">From Amazon link or ASIN</p>
      <p className="mt-1 text-xs text-neutral-600">
        Paste a product URL (tracking query strings are removed) or a 10-character ASIN. You can also drop a
        link here.
        {!partnerTag?.trim() ? (
          <span className="mt-1 block text-amber-800">
            Set <span className="font-mono">AMAZON_PARTNER_TAG</span> in the server env to append your Associates
            tag. Links still work without it.
          </span>
        ) : null}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setHint(null);
          }}
          placeholder="https://www.amazon.com/…/dp/B0… or B0XXXXXXXXXX"
          className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 font-mono text-sm"
        />
        <button
          type="button"
          onClick={apply}
          className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Add product
        </button>
      </div>
      {hint ? <p className="mt-2 text-sm text-neutral-600">{hint}</p> : null}
    </div>
  );
}
