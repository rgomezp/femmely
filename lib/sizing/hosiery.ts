import type { HosieryMatrixMap } from "./types";

/**
 * Non-overlapping height × weight grid (half-open bins).
 * Rows: 4'10"–5'4", 5'4"–5'8", 5'8"–6'0", 6'0"+
 * Cols: weight bands aligned with typical hosiery charts.
 */
export const hosierySizing: HosieryMatrixMap = {
  type: "hosiery-matrix",
  inputs: [
    { key: "height", label: "Height (inches)", min: 58, max: 78, step: 0.5 },
    { key: "weight", label: "Weight (lbs)", min: 95, max: 260, step: 1 },
  ],
  heightEdges: [58, 64, 68, 72, 78],
  weightEdges: [95, 130, 170, 210, 260],
  cells: [
    ["A", "B", "Q (Queen)", "Q (Queen)"],
    ["A", "B", "C", "Q (Queen)"],
    ["B", "C", "D", "Q (Queen)"],
    ["B", "C", "D", "Q (Queen)"],
  ],
};
