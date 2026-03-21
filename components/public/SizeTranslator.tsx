"use client";

import type { GarmentCategory } from "@/lib/sizing/types";
import { converterMap } from "@/lib/sizing";
import { BraSizeConverter } from "./BraSizeConverter";
import { DirectSizeConverter } from "./DirectSizeConverter";
import { HosieryConverter } from "./HosieryConverter";
import { MeasurementConverter } from "./MeasurementConverter";

export function SizeTranslator({
  garmentCategory,
}: {
  garmentCategory: GarmentCategory | string;
}) {
  const cat = garmentCategory as GarmentCategory;
  const conv = converterMap[cat];
  if (!conv || cat === "none") return null;

  if (conv.type === "direct") {
    return <DirectSizeConverter categoryKey={cat} map={conv} />;
  }
  if (conv.type === "calculated-bra") {
    return <BraSizeConverter categoryKey={cat} map={conv} />;
  }
  if (conv.type === "hosiery-matrix") {
    return <HosieryConverter categoryKey={cat} map={conv} />;
  }
  return <MeasurementConverter categoryKey={cat} map={conv} />;
}
