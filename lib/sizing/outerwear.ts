import type { DirectSizeMap } from "./types";

export const outerwearSizing: DirectSizeMap = {
  type: "direct",
  label: "Men's jacket size",
  targetLabel: "Women's jacket size",
  mappings: [
    { source: "XS", target: "S" },
    { source: "S", target: "M" },
    { source: "M", target: "L" },
    { source: "L", target: "XL" },
    { source: "XL", target: "1X - 2X" },
    { source: "2XL", target: "2X - 3X" },
    { source: "3XL", target: "3X - 4X" },
  ],
};
