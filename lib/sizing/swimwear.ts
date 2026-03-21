import type { MeasurementBasedMap } from "./types";

export const swimwearSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [
    { key: "bust", label: "Bust (inches)", min: 30, max: 50, step: 0.5 },
    { key: "waist", label: "Waist (inches)", min: 24, max: 44, step: 0.5 },
    { key: "hip", label: "Hip (inches)", min: 32, max: 52, step: 0.5 },
  ],
  ranges: [
    {
      size: "4 (S)",
      conditions: [
        { key: "bust", min: 32, max: 35 },
        { key: "waist", min: 26, max: 28 },
        { key: "hip", min: 35, max: 38 },
      ],
    },
    {
      size: "8 (M)",
      conditions: [
        { key: "bust", min: 35, max: 38 },
        { key: "waist", min: 28, max: 31 },
        { key: "hip", min: 38, max: 41 },
      ],
    },
    {
      size: "12 (L)",
      conditions: [
        { key: "bust", min: 38, max: 41 },
        { key: "waist", min: 31, max: 34 },
        { key: "hip", min: 41, max: 44 },
      ],
    },
    {
      size: "16 (XL)",
      conditions: [
        { key: "bust", min: 41, max: 45 },
        { key: "waist", min: 34, max: 38 },
        { key: "hip", min: 44, max: 48 },
      ],
    },
  ],
};
