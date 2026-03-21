"use client";

import { GARMENT_CATEGORY_LABELS, SIZING_CATEGORY_SLUGS } from "@/lib/sizing/types";

export function GarmentCategorySelect({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <select
      id={id}
      className="mt-1 w-full rounded-xl border border-neutral-200 px-2 py-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="none">{GARMENT_CATEGORY_LABELS.none}</option>
      {SIZING_CATEGORY_SLUGS.map((slug) => (
        <option key={slug} value={slug}>
          {GARMENT_CATEGORY_LABELS[slug]}
        </option>
      ))}
    </select>
  );
}
