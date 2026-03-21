import type { DirectSizeMap } from "./types";

export const topsSizing: DirectSizeMap = {
  type: "direct",
  label: "Men's shirt size",
  targetLabel: "Women's size",
  mappings: [
    { source: "XS", target: "S - M" },
    { source: "S", target: "M - L" },
    { source: "M", target: "L - XL" },
    { source: "L", target: "XL - 1X" },
    { source: "XL", target: "1X - 2X" },
    { source: "2XL", target: "2X - 3X" },
    { source: "3XL", target: "3X - 4X" },
  ],
};
