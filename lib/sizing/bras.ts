import type { MeasurementBasedMap } from "./types";

/** Underbust → band; cup from (overbust − underbust) inches. */
export const brasSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [
    { key: "underbust", label: "Underbust (inches)", min: 28, max: 48, step: 0.5 },
    { key: "overbust", label: "Overbust / bust (inches)", min: 30, max: 54, step: 0.5 },
  ],
  ranges: [
    { size: "32A", conditions: [{ key: "underbust", min: 28, max: 30 }, { key: "overbust", min: 31, max: 33 }] },
    { size: "32B", conditions: [{ key: "underbust", min: 28, max: 30 }, { key: "overbust", min: 33, max: 34 }] },
    { size: "34B", conditions: [{ key: "underbust", min: 30, max: 32 }, { key: "overbust", min: 34, max: 36 }] },
    { size: "34C", conditions: [{ key: "underbust", min: 30, max: 32 }, { key: "overbust", min: 36, max: 37 }] },
    { size: "36C", conditions: [{ key: "underbust", min: 32, max: 34 }, { key: "overbust", min: 37, max: 39 }] },
    { size: "36D", conditions: [{ key: "underbust", min: 32, max: 34 }, { key: "overbust", min: 39, max: 40 }] },
    { size: "38D", conditions: [{ key: "underbust", min: 34, max: 36 }, { key: "overbust", min: 40, max: 42 }] },
    { size: "38DD", conditions: [{ key: "underbust", min: 34, max: 36 }, { key: "overbust", min: 42, max: 43 }] },
    { size: "40DD", conditions: [{ key: "underbust", min: 36, max: 38 }, { key: "overbust", min: 43, max: 45 }] },
    { size: "42DD", conditions: [{ key: "underbust", min: 38, max: 40 }, { key: "overbust", min: 45, max: 47 }] },
    { size: "44DDD", conditions: [{ key: "underbust", min: 40, max: 42 }, { key: "overbust", min: 47, max: 49 }] },
  ],
};
