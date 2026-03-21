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
      <label className="block text-sm font-medium text-[var(--color-text-primary)]">
        {map.label}
        <select
          className="mt-2 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)]"
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
        <div className="rounded-xl border border-[var(--color-border-secondary)] bg-[var(--color-accent-secondary)]/5 p-4 transition-opacity">
          <p className="text-sm text-[var(--color-text-secondary)]">{map.targetLabel}</p>
          <p className="text-xl font-semibold text-[var(--color-text-primary)]">{result.target}</p>
          {result.eu ? (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">EU: {result.eu}</p>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead className="bg-[var(--color-bg)]">
            <tr>
              <th className="p-2 font-medium">{map.label}</th>
              <th className="p-2 font-medium">{map.targetLabel}</th>
              {map.mappings.some((m) => m.eu) ? <th className="p-2 font-medium">EU</th> : null}
            </tr>
          </thead>
          <tbody>
            {map.mappings.map((m) => (
              <tr key={m.source} className="border-t border-[var(--color-border)]">
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
