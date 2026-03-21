import type { CalculatedBraMap } from "./types";

export const brasSizing: CalculatedBraMap = {
  type: "calculated-bra",
  inputs: [
    { key: "underbust", label: "Underbust (inches)", min: 28, max: 48, step: 0.5 },
    { key: "overbust", label: "Overbust / bust (inches)", min: 30, max: 54, step: 0.5 },
  ],
};

/** US band: underbust rounded to nearest even inch. Cup from (overbust − underbust). */
export function computeBraSize(
  underbust: number,
  overbust: number,
): string | null {
  if (Number.isNaN(underbust) || Number.isNaN(overbust)) return null;
  if (overbust <= underbust) return null;

  const band = Math.round(underbust / 2) * 2;
  if (band < 28 || band > 54) return null;

  const diff = overbust - underbust;
  const cup = cupFromDifference(diff);
  if (!cup) return null;

  return `${band}${cup}`;
}

function cupFromDifference(diff: number): string | null {
  if (diff < 0.5) return null;
  if (diff < 1) return "AA";
  if (diff < 2) return "A";
  if (diff < 3) return "B";
  if (diff < 4) return "C";
  if (diff < 5) return "D";
  if (diff < 6) return "DD";
  if (diff < 7) return "DDD";
  return "DDD+";
}
