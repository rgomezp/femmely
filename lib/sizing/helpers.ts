import type { DirectSizeMap, MeasurementBasedMap } from "./types";

export function directLookup(
  map: DirectSizeMap,
  source: string,
): { target: string; eu?: string } | null {
  const row = map.mappings.find((m) => m.source === source);
  if (!row) return null;
  return { target: row.target, eu: row.eu };
}

/** Half-open intervals: value >= min && value < max (matches spec tables). */
export function measurementResult(
  map: MeasurementBasedMap,
  values: Record<string, number>,
): string | null {
  for (const range of map.ranges) {
    const ok = range.conditions.every((c) => {
      const v = values[c.key];
      if (v === undefined || Number.isNaN(v)) return false;
      return v >= c.min && v < c.max;
    });
    if (ok) return range.size;
  }
  return null;
}
