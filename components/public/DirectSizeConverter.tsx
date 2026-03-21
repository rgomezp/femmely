"use client";

import { useEffect, useState } from "react";
import type { DirectSizeMap } from "@/lib/sizing/types";
import { directLookup } from "@/lib/sizing/helpers";

const LS_KEY = "femmely:size-prefs";

function readDirect(category: string): string | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as Record<string, { direct?: string }>;
    return j[category]?.direct ?? null;
  } catch {
    return null;
  }
}

function writeDirect(category: string, source: string) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const j = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    j[category] = { ...(typeof j[category] === "object" && j[category] !== null ? j[category] : {}), direct: source };
    localStorage.setItem(LS_KEY, JSON.stringify(j));
  } catch {
    /* ignore */
  }
}

export function DirectSizeConverter({
  categoryKey,
  map,
}: {
  categoryKey: string;
  map: DirectSizeMap;
}) {
  const sources = map.mappings.map((m) => m.source);
  const [value, setValue] = useState(sources[0] ?? "");

  useEffect(() => {
    const saved = readDirect(categoryKey);
    if (saved && sources.includes(saved)) setValue(saved);
  }, [categoryKey, sources]);

  const result = directLookup(map, value);

  return (
    <div className="space-y-4">
      <label className="block font-body text-sm font-medium text-on-surface">
        {map.label}
        <select
          className="mt-2 w-full min-h-11 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            writeDirect(categoryKey, e.target.value);
          }}
        >
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      {result ? (
        <div className="rounded-xl border border-primary/20 bg-primary-fixed p-6 transition-opacity">
          <p className="font-body text-sm text-on-surface-variant">{map.targetLabel}</p>
          <p className="font-headline mt-2 text-center text-3xl text-primary">{result.target}</p>
          {result.eu ? (
            <p className="mt-2 text-center font-body text-sm text-on-surface-variant">EU: {result.eu}</p>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="p-2 font-medium">{map.label}</th>
              <th className="p-2 font-medium">{map.targetLabel}</th>
              {map.mappings.some((m) => m.eu) ? <th className="p-2 font-medium">EU</th> : null}
            </tr>
          </thead>
          <tbody>
            {map.mappings.map((m) => (
              <tr key={m.source} className="border-t border-outline-variant">
                <td className="p-2">{m.source}</td>
                <td className="p-2">{m.target}</td>
                {map.mappings.some((x) => x.eu) ? <td className="p-2">{m.eu ?? "—"}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
