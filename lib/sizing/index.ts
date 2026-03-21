import type { GarmentCategory, SizeConverter } from "./types";
import { activewearSizing } from "./activewear";
import { bottomsPantsSizing } from "./bottoms-pants";
import { bottomsSkirtsSizing } from "./bottoms-skirts";
import { brasSizing } from "./bras";
import { dressesSizing } from "./dresses";
import { hosierySizing } from "./hosiery";
import { noneSizing } from "./none";
import { outerwearSizing } from "./outerwear";
import { shoesSizing } from "./shoes";
import { swimwearSizing } from "./swimwear";
import { topsSizing } from "./tops";
import { underwearSizing } from "./underwear";

export * from "./types";
export * from "./helpers";
export { computeBraSize } from "./bras";

export const converterMap: Record<GarmentCategory, SizeConverter> = {
  shoes: shoesSizing,
  tops: topsSizing,
  "bottoms-pants": bottomsPantsSizing,
  "bottoms-skirts": bottomsSkirtsSizing,
  dresses: dressesSizing,
  bras: brasSizing,
  underwear: underwearSizing,
  outerwear: outerwearSizing,
  activewear: activewearSizing,
  swimwear: swimwearSizing,
  hosiery: hosierySizing,
  none: noneSizing,
};

export function getConverter(category: string): SizeConverter | null {
  if (category in converterMap) {
    return converterMap[category as GarmentCategory];
  }
  return null;
}
