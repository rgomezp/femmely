"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  SAVED_OUTFITS_CHANGED,
  isOutfitSaved,
  notifySavedOutfitsChanged,
  toggleSavedOutfit,
} from "@/lib/saved-outfits";

export function BookmarkButton({
  outfitId,
  size = "sm",
  onSavedChange,
}: {
  outfitId: string;
  size?: "sm" | "md";
  onSavedChange?: (saved: boolean) => void;
}) {
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    setSaved(isOutfitSaved(outfitId));
  }, [outfitId]);

  useEffect(() => {
    const sync = () => setSaved(isOutfitSaved(outfitId));
    window.addEventListener(SAVED_OUTFITS_CHANGED, sync);
    return () => window.removeEventListener(SAVED_OUTFITS_CHANGED, sync);
  }, [outfitId]);

  const iconClass = size === "md" ? "text-2xl" : "text-xl";

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save outfit"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const nowSaved = toggleSavedOutfit(outfitId);
        setSaved(nowSaved);
        notifySavedOutfitsChanged();
        onSavedChange?.(nowSaved);
        setAnimate(true);
        window.setTimeout(() => setAnimate(false), 150);
      }}
      className={
        size === "md"
          ? `inline-flex cursor-pointer items-center gap-2 rounded-lg font-label text-sm transition-colors ${
              saved ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`
          : `inline-flex cursor-pointer rounded-lg p-1 transition-colors ${
              saved ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`
      }
    >
      {size === "md" ? (
        <>
          <Icon
            name="bookmark"
            filled={saved}
            className={`${iconClass} transition-transform duration-150 ease-out ${
              animate ? "scale-125" : "scale-100"
            }`}
          />
          <span>{saved ? "Saved" : "Save"}</span>
        </>
      ) : (
        <Icon
          name="bookmark"
          filled={saved}
          className={`${iconClass} transition-transform duration-150 ease-out ${
            animate ? "scale-125" : "scale-100"
          }`}
        />
      )}
    </button>
  );
}
