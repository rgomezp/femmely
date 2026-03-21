import type { MeasurementBasedMap } from "./types";

/**
 * Bust, waist, hip (inches). Waist/hip bands follow bottoms-pants numeric sizing;
 * bust bands tile with half-open intervals per size.
 */
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
        { key: "bust", min: 30, max: 32 },
        { key: "waist", min: 24, max: 25 },
        { key: "hip", min: 32, max: 34 },
      ],
    },
    {
      size: "0 (XS)",
      conditions: [
        { key: "bust", min: 32, max: 33 },
        { key: "waist", min: 25, max: 26 },
        { key: "hip", min: 34, max: 35 },
      ],
    },
    {
      size: "2 (S)",
      conditions: [
        { key: "bust", min: 33, max: 34 },
        { key: "waist", min: 26, max: 27 },
        { key: "hip", min: 35, max: 36 },
      ],
    },
    {
      size: "4 (S)",
      conditions: [
        { key: "bust", min: 34, max: 35 },
        { key: "waist", min: 27, max: 28 },
        { key: "hip", min: 36, max: 37 },
      ],
    },
    {
      size: "6 (M)",
      conditions: [
        { key: "bust", min: 35, max: 37 },
        { key: "waist", min: 28, max: 29 },
        { key: "hip", min: 37, max: 38.5 },
      ],
    },
    {
      size: "8 (M)",
      conditions: [
        { key: "bust", min: 37, max: 38.5 },
        { key: "waist", min: 29, max: 30 },
        { key: "hip", min: 38.5, max: 40 },
      ],
    },
    {
      size: "10 (L)",
      conditions: [
        { key: "bust", min: 38.5, max: 40 },
        { key: "waist", min: 30, max: 31 },
        { key: "hip", min: 40, max: 41.5 },
      ],
    },
    {
      size: "12 (L)",
      conditions: [
        { key: "bust", min: 40, max: 41.5 },
        { key: "waist", min: 31, max: 33 },
        { key: "hip", min: 41.5, max: 43 },
      ],
    },
    {
      size: "14 (XL)",
      conditions: [
        { key: "bust", min: 41.5, max: 43 },
        { key: "waist", min: 33, max: 35 },
        { key: "hip", min: 43, max: 45 },
      ],
    },
    {
      size: "16 (XL)",
      conditions: [
        { key: "bust", min: 43, max: 45 },
        { key: "waist", min: 35, max: 37 },
        { key: "hip", min: 45, max: 47 },
      ],
    },
    {
      size: "18 (2XL)",
      conditions: [
        { key: "bust", min: 45, max: 47 },
        { key: "waist", min: 37, max: 39 },
        { key: "hip", min: 47, max: 49 },
      ],
    },
    {
      size: "20 (2XL)",
      conditions: [
        { key: "bust", min: 47, max: 50 },
        { key: "waist", min: 39, max: 41 },
        { key: "hip", min: 49, max: 51 },
      ],
    },
  ],
};
