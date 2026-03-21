import type { MeasurementBasedMap } from "./types";

export const bottomsSkirtsSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [{ key: "waist", label: "Waist (inches)", min: 24, max: 44, step: 0.5 }],
  ranges: [
    { size: "00", conditions: [{ key: "waist", min: 24, max: 25 }] },
    { size: "0", conditions: [{ key: "waist", min: 25, max: 26 }] },
    { size: "2", conditions: [{ key: "waist", min: 26, max: 27 }] },
    { size: "4", conditions: [{ key: "waist", min: 27, max: 28 }] },
    { size: "6", conditions: [{ key: "waist", min: 28, max: 29 }] },
    { size: "8", conditions: [{ key: "waist", min: 29, max: 30 }] },
    { size: "10", conditions: [{ key: "waist", min: 30, max: 31 }] },
    { size: "12", conditions: [{ key: "waist", min: 31, max: 33 }] },
    { size: "14", conditions: [{ key: "waist", min: 33, max: 35 }] },
    { size: "16", conditions: [{ key: "waist", min: 35, max: 37 }] },
    { size: "18", conditions: [{ key: "waist", min: 37, max: 39 }] },
    { size: "20", conditions: [{ key: "waist", min: 39, max: 41 }] },
  ],
};
