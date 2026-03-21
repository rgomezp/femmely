import type { MeasurementBasedMap } from "./types";

/** Hip-first (how underwear sits); waist secondary — aligned with common MTF/inclusive charts. */
export const underwearSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [
    { key: "hip", label: "Hip (inches)", min: 32, max: 52, step: 0.5 },
    { key: "waist", label: "Waist (inches)", min: 26, max: 46, step: 0.5 },
  ],
  ranges: [
    {
      size: "XS",
      conditions: [
        { key: "hip", min: 32, max: 35 },
        { key: "waist", min: 26, max: 30 },
      ],
    },
    {
      size: "S",
      conditions: [
        { key: "hip", min: 35, max: 37 },
        { key: "waist", min: 30, max: 33 },
      ],
    },
    {
      size: "M",
      conditions: [
        { key: "hip", min: 37, max: 40 },
        { key: "waist", min: 33, max: 36 },
      ],
    },
    {
      size: "L",
      conditions: [
        { key: "hip", min: 40, max: 43 },
        { key: "waist", min: 36, max: 39 },
      ],
    },
    {
      size: "XL",
      conditions: [
        { key: "hip", min: 43, max: 46 },
        { key: "waist", min: 39, max: 41 },
      ],
    },
    {
      size: "2XL",
      conditions: [
        { key: "hip", min: 46, max: 50 },
        { key: "waist", min: 41, max: 44 },
      ],
    },
  ],
};
