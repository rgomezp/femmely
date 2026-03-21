export const STORAGE_KEY = "femmely_saved_outfits";

export const SAVED_OUTFITS_CHANGED = "femmely-saved-outfits-changed";

export function notifySavedOutfitsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SAVED_OUTFITS_CHANGED));
}

export function getSavedOutfits(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSavedOutfit(outfitId: string): boolean {
  const saved = getSavedOutfits();
  const index = saved.indexOf(outfitId);
  if (index > -1) {
    saved.splice(index, 1);
  } else {
    saved.push(outfitId);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return index === -1;
}

export function isOutfitSaved(outfitId: string): boolean {
  return getSavedOutfits().includes(outfitId);
}

export function clearAllSavedOutfits(): void {
  localStorage.removeItem(STORAGE_KEY);
}
