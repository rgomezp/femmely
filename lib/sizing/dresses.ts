import type { MeasurementBasedMap } from "./types";

/** Bust, waist, hip in inches — conservative combined bands. */
export const dressesSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [
    { key: "bust", label: "Bust / chest (inches)", min: 30, max: 52, step: 0.5 },
    { key: "waist", label: "Waist (inches)", min: 24, max: 48, step: 0.5 },
    { key: "hip", label: "Hip (inches)", min: 32, max: 54, step: 0.5 },
  ],
  ranges: [
    {
      size: "00 (XS)",
      conditions: [
        { key: "bust", min: 30, max: 33 },
        { key: "waist", min: 24, max: 25 },
        { key: "hip", min: 33, max: 35 },
      ],
    },
    {
      size: "4 (S)",
      conditions: [
        { key: "bust", min: 33, max: 36 },
        { key: "waist", min: 26, max: 28 },
        { key: "hip", min: 35, max: 38 },
      ],
    },
    {
      size: "8 (M)",
      conditions: [
        { key: "bust", min: 36, max: 39 },
        { key: "waist", min: 28, max: 31 },
        { key: "hip", min: 38, max: 41 },
      ],
    },
    {
      size: "12 (L)",
      conditions: [
        { key: "bust", min: 39, max: 42 },
        { key: "waist", min: 31, max: 34 },
        { key: "hip", min: 41, max: 44 },
      ],
    },
    {
      size: "16 (XL)",
      conditions: [
        { key: "bust", min: 42, max: 45 },
        { key: "waist", min: 34, max: 37 },
        { key: "hip", min: 44, max: 47 },
      ],
    },
    {
      size: "20 (2XL)",
      conditions: [
        { key: "bust", min: 45, max: 49 },
        { key: "waist", min: 37, max: 41 },
        { key: "hip", min: 47, max: 51 },
      ],
    },
  ],
};
