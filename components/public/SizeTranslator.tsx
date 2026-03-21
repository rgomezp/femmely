"use client";

import type { GarmentCategory } from "@/lib/sizing/types";
import { converterMap } from "@/lib/sizing";
import { DirectSizeConverter } from "./DirectSizeConverter";
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
  return <MeasurementConverter categoryKey={cat} map={conv} />;
}
