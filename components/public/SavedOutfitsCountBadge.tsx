"use client";

import { useEffect, useState } from "react";
import { SAVED_OUTFITS_CHANGED, getSavedOutfits } from "@/lib/saved-outfits";

export function SavedOutfitsCountBadge({
  variant = "default",
}: {
  /** Use on primary-filled controls (e.g. active bottom nav pill). */
  variant?: "default" | "onPrimary" | "header";
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getSavedOutfits().length);
    sync();
    window.addEventListener(SAVED_OUTFITS_CHANGED, sync);
    return () => window.removeEventListener(SAVED_OUTFITS_CHANGED, sync);
  }, []);

  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  const tone =
    variant === "onPrimary"
      ? "bg-on-primary text-primary"
      : "bg-primary text-on-primary";

  const positionClass =
    variant === "header"
      ? "right-0 top-0 translate-x-1/2 -translate-y-1/2"
      : "-right-1 -top-1";

  const sizeClass =
    variant === "header"
      ? "h-4 min-w-4 shrink-0 px-0.5"
      : "h-4 w-4";

  return (
    <span
      className={`absolute ${positionClass} flex ${sizeClass} items-center justify-center rounded-full font-label text-[10px] leading-none ${tone}`}
      aria-hidden
    >
      {label}
    </span>
  );
}
