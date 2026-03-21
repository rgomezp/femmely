import type { MeasurementBasedMap } from "./types";

export const underwearSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [{ key: "waist", label: "Waist (inches)", min: 26, max: 46, step: 0.5 }],
  ranges: [
    { size: "XS", conditions: [{ key: "waist", min: 26, max: 28 }] },
    { size: "S", conditions: [{ key: "waist", min: 28, max: 30 }] },
    { size: "M", conditions: [{ key: "waist", min: 30, max: 33 }] },
    { size: "L", conditions: [{ key: "waist", min: 33, max: 36 }] },
    { size: "XL", conditions: [{ key: "waist", min: 36, max: 39 }] },
    { size: "2XL", conditions: [{ key: "waist", min: 39, max: 43 }] },
  ],
};
