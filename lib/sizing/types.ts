export type GarmentCategory =
  | "shoes"
  | "tops"
  | "bottoms-pants"
  | "bottoms-skirts"
  | "dresses"
  | "bras"
  | "underwear"
  | "outerwear"
  | "activewear"
  | "swimwear"
  | "hosiery"
  | "none";

export interface DirectSizeMap {
  type: "direct";
  label: string;
  targetLabel: string;
  mappings: {
    source: string;
    target: string;
    eu?: string;
  }[];
}

export interface MeasurementBasedMap {
  type: "measurement";
  inputs: {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
  }[];
  ranges: {
    size: string;
    conditions: {
      key: string;
      min: number;
      max: number;
    }[];
  }[];
}

/** Band + cup from underbust/overbust via `computeBraSize` (see bras.ts). */
export interface CalculatedBraMap {
  type: "calculated-bra";
  inputs: {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
  }[];
}

/**
 * Height/weight bins — non-overlapping: value in [edges[i], edges[i+1]).
 * `cells[row][col]` matches height row × weight column.
 */
export interface HosieryMatrixMap {
  type: "hosiery-matrix";
  inputs: {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
  }[];
  heightEdges: number[];
  weightEdges: number[];
  cells: string[][];
}

export type SizeConverter =
  | DirectSizeMap
  | MeasurementBasedMap
  | CalculatedBraMap
  | HosieryMatrixMap;

export const GARMENT_CATEGORY_LABELS: Record<GarmentCategory, string> = {
  shoes: "Shoes",
  tops: "Tops & Blouses",
  "bottoms-pants": "Pants & Jeans",
  "bottoms-skirts": "Skirts",
  dresses: "Dresses",
  bras: "Bras",
  underwear: "Underwear & Panties",
  outerwear: "Jackets & Coats",
  activewear: "Activewear & Leggings",
  swimwear: "Swimwear",
  hosiery: "Tights & Hosiery",
  none: "No sizing",
};

export const SIZING_CATEGORY_SLUGS: GarmentCategory[] = [
  "shoes",
  "tops",
  "bottoms-pants",
  "bottoms-skirts",
  "dresses",
  "bras",
  "underwear",
  "outerwear",
  "activewear",
  "swimwear",
  "hosiery",
];

export function isGarmentCategory(s: string): s is GarmentCategory {
  return s in GARMENT_CATEGORY_LABELS;
}
