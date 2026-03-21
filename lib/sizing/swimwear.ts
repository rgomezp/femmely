import type { MeasurementBasedMap } from "./types";

/** Bust bands tile [30,47); waist/hip follow each row so typical proportions match one size. */
export const swimwearSizing: MeasurementBasedMap = {
  type: "measurement",
  inputs: [
    { key: "bust", label: "Bust (inches)", min: 30, max: 50, step: 0.5 },
    { key: "waist", label: "Waist (inches)", min: 24, max: 44, step: 0.5 },
    { key: "hip", label: "Hip (inches)", min: 32, max: 52, step: 0.5 },
  ],
  ranges: [
    {
      size: "2 (XS)",
      conditions: [
        { key: "bust", min: 30, max: 33 },
        { key: "waist", min: 24, max: 26 },
        { key: "hip", min: 32, max: 35 },
      ],
    },
    {
      size: "4 (S)",
      conditions: [
        { key: "bust", min: 33, max: 35 },
        { key: "waist", min: 26, max: 28 },
        { key: "hip", min: 35, max: 37 },
      ],
    },
    {
      size: "6 (S)",
      conditions: [
        { key: "bust", min: 35, max: 37 },
        { key: "waist", min: 27.5, max: 29 },
        { key: "hip", min: 37, max: 39 },
      ],
    },
    {
      size: "8 (M)",
      conditions: [
        { key: "bust", min: 37, max: 39 },
        { key: "waist", min: 28, max: 30.5 },
        { key: "hip", min: 38.5, max: 41 },
      ],
    },
    {
      size: "10 (M)",
      conditions: [
        { key: "bust", min: 39, max: 41 },
        { key: "waist", min: 29.5, max: 32 },
        { key: "hip", min: 40, max: 42.5 },
      ],
    },
    {
      size: "12 (L)",
      conditions: [
        { key: "bust", min: 41, max: 43 },
        { key: "waist", min: 31, max: 33.5 },
        { key: "hip", min: 41.5, max: 44 },
      ],
    },
    {
      size: "14 (L)",
      conditions: [
        { key: "bust", min: 43, max: 45 },
        { key: "waist", min: 32.5, max: 35 },
        { key: "hip", min: 43.5, max: 46 },
      ],
    },
    {
      size: "16 (XL)",
      conditions: [
        { key: "bust", min: 45, max: 47 },
        { key: "waist", min: 34, max: 38 },
        { key: "hip", min: 44, max: 48 },
      ],
    },
  ],
};
