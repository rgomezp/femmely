import type { MeasurementBasedMap } from "./types";

export const activewearSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [
    { key: "waist", label: "Waist (inches)", min: 26, max: 44, step: 0.5 },
    { key: "hip", label: "Hip (inches)", min: 34, max: 52, step: 0.5 },
  ],
  ranges: [
    { size: "XS", conditions: [{ key: "waist", min: 26, max: 28 }, { key: "hip", min: 34, max: 37 }] },
    { size: "S", conditions: [{ key: "waist", min: 28, max: 30 }, { key: "hip", min: 37, max: 39 }] },
    { size: "M", conditions: [{ key: "waist", min: 30, max: 33 }, { key: "hip", min: 39, max: 42 }] },
    { size: "L", conditions: [{ key: "waist", min: 33, max: 36 }, { key: "hip", min: 42, max: 45 }] },
    { size: "XL", conditions: [{ key: "waist", min: 36, max: 39 }, { key: "hip", min: 45, max: 48 }] },
    { size: "2XL", conditions: [{ key: "waist", min: 39, max: 42 }, { key: "hip", min: 48, max: 51 }] },
  ],
};
