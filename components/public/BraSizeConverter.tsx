"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalculatedBraMap } from "@/lib/sizing/types";
import { computeBraSize } from "@/lib/sizing/bras";

const LS_KEY = "femmely:size-prefs";

function readMeas(category: string): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as Record<string, { meas?: Record<string, number> }>;
    return j[category]?.meas ?? null;
  } catch {
    return null;
  }
}

function writeMeas(category: string, meas: Record<string, number>) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const j = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    j[category] = { ...(typeof j[category] === "object" && j[category] !== null ? j[category] : {}), meas };
    localStorage.setItem(LS_KEY, JSON.stringify(j));
  } catch {
    /* ignore */
  }
}

export function BraSizeConverter({
  categoryKey,
  map,
}: {
  categoryKey: string;
  map: CalculatedBraMap;
}) {
  const initial = useMemo(() => {
    const o: Record<string, number> = {};
    for (const inp of map.inputs) {
      o[inp.key] = inp.min;
    }
    return o;
  }, [map.inputs]);

  const [values, setValues] = useState(initial);

  useEffect(() => {
    const saved = readMeas(categoryKey);
    if (saved) {
      setValues((v) => {
        const next = { ...v };
        for (const k of Object.keys(saved)) {
          if (k in next) next[k] = saved[k];
        }
        return next;
      });
    }
  }, [categoryKey]);

  const u = values.underbust;
  const o = values.overbust;
  const size =
    u !== undefined && o !== undefined && !Number.isNaN(u) && !Number.isNaN(o)
      ? computeBraSize(u, o)
      : null;

  const update = (key: string, n: number) => {
    setValues((prev) => {
      const next = { ...prev, [key]: n };
      writeMeas(categoryKey, next);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {map.inputs.map((inp) => (
        <div key={inp.key}>
          <div className="flex justify-between font-body text-sm font-medium text-on-surface">
            <span>{inp.label}</span>
            <span className="text-tertiary">{values[inp.key]?.toFixed(inp.step < 1 ? 1 : 0)}</span>
          </div>
          <input
            type="range"
            min={inp.min}
            max={inp.max}
            step={inp.step}
            value={values[inp.key] ?? inp.min}
            className="mt-2 h-11 w-full rounded-xl accent-primary"
            onChange={(e) => update(inp.key, Number(e.target.value))}
          />
        </div>
      ))}
      <div
        className={`rounded-xl border p-6 transition-all ${size ? "border-primary/20 bg-primary-fixed" : "border-outline-variant bg-surface-container-low"}`}
      >
        {size ? (
          <>
            <p className="font-body text-sm text-on-surface-variant">Estimated US bra size</p>
            <p className="font-headline mt-2 text-center text-3xl text-primary">{size}</p>
            <p className="mt-3 font-body text-xs text-on-surface-variant">
              Band is your underbust rounded to the nearest even inch. Cup is based on the difference
              between overbust and underbust. Fit varies by brand and style.
            </p>
          </>
        ) : (
          <p className="font-body text-sm text-on-surface-variant">
            Set overbust above underbust to estimate a size. Very small or large differences may fall
            outside this simplified chart.
          </p>
        )}
      </div>
      <p className="font-body text-xs text-on-surface-variant">
        For the best fit, consider a professional fitting — especially for full-cup or sports styles.
      </p>
    </div>
  );
}
