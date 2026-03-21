import type { MeasurementBasedMap } from "./types";

/** Height inches + weight lbs → common hosiery letter sizes (illustrative). */
export const hosierySizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [
    { key: "height", label: "Height (inches)", min: 58, max: 78, step: 0.5 },
    { key: "weight", label: "Weight (lbs)", min: 95, max: 260, step: 1 },
  ],
  ranges: [
    { size: "A", conditions: [{ key: "height", min: 58, max: 64 }, { key: "weight", min: 95, max: 130 }] },
    { size: "B", conditions: [{ key: "height", min: 62, max: 68 }, { key: "weight", min: 125, max: 165 }] },
    { size: "C", conditions: [{ key: "height", min: 64, max: 72 }, { key: "weight", min: 155, max: 200 }] },
    { size: "D", conditions: [{ key: "height", min: 66, max: 74 }, { key: "weight", min: 190, max: 230 }] },
    { size: "Q (Queen)", conditions: [{ key: "height", min: 60, max: 72 }, { key: "weight", min: 200, max: 260 }] },
  ],
};
