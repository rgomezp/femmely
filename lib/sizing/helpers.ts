import type {
  DirectSizeMap,
  HosieryMatrixMap,
  MeasurementBasedMap,
} from "./types";

export function directLookup(
  map: DirectSizeMap,
  source: string,
): { target: string; eu?: string } | null {
  const row = map.mappings.find((m) => m.source === source);
  if (!row) return null;
  return { target: row.target, eu: row.eu };
}

/**
 * Score how well a set of values matches a size's conditions.
 * Returns 0 for a perfect match (all values within range).
 * Returns a positive number representing total "distance" from the ranges.
 * Lower is better.
 */
function matchScore(
  conditions: { key: string; min: number; max: number }[],
  values: Record<string, number>,
): number {
  let totalDistance = 0;
  for (const c of conditions) {
    const v = values[c.key];
    if (v === undefined || Number.isNaN(v)) return Infinity;
    if (v < c.min) {
      totalDistance += c.min - v;
    } else if (v >= c.max) {
      totalDistance += v - c.max + 0.01; // half-open: v == max is just outside
    }
    // else: v is inside [min, max) — contributes 0
  }
  return totalDistance;
}

/**
 * Primary: exact match using half-open intervals (value >= min && value < max).
 * Fallback: if no exact match, return the closest size by total measurement
 * distance. This handles male anatomy where proportions (e.g., narrow hips
 * relative to waist) may not align with any single women's size perfectly.
 *
 * Returns { size, exact } where exact=false means it's a best-fit estimate.
 */
export function measurementResult(
  map: MeasurementBasedMap,
  values: Record<string, number>,
): { size: string; exact: boolean } | null {
  // Check we have all required inputs
  for (const input of map.inputs) {
    const v = values[input.key];
    if (v === undefined || Number.isNaN(v)) return null;
  }

  // Try exact match first
  for (const range of map.ranges) {
    const ok = range.conditions.every((c) => {
      const v = values[c.key]!;
      return v >= c.min && v < c.max;
    });
    if (ok) return { size: range.size, exact: true };
  }

  // No exact match — find the closest size by total distance
  let bestSize: string | null = null;
  let bestScore = Infinity;

  for (const range of map.ranges) {
    const score = matchScore(range.conditions, values);
    if (score < bestScore) {
      bestScore = score;
      bestSize = range.size;
    }
  }

  if (bestSize !== null && bestScore < Infinity) {
    return { size: bestSize, exact: false };
  }

  return null;
}

/** Half-open bins; last bin includes its upper edge so slider max values match. */
function binIndex(value: number, edges: number[]): number {
  for (let i = 0; i < edges.length - 1; i++) {
    const isLast = i === edges.length - 2;
    const upper = edges[i + 1];
    if (value >= edges[i] && (isLast ? value <= upper : value < upper)) return i;
  }
  return -1;
}

/** Half-open bins on height and weight — no overlapping cells. */
export function hosieryMatrixResult(
  map: HosieryMatrixMap,
  values: Record<string, number>,
): string | null {
  const h = values.height;
  const w = values.weight;
  if (h === undefined || w === undefined || Number.isNaN(h) || Number.isNaN(w)) {
    return null;
  }
  const row = binIndex(h, map.heightEdges);
  const col = binIndex(w, map.weightEdges);
  if (row < 0 || col < 0) return null;
  return map.cells[row]?.[col] ?? null;
}