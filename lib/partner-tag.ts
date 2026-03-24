import { buildCleanAffiliateUrl, normalizeMarketplaceHost } from "@/lib/amazon-url";

export type SiteSettingsPartnerTagRow = {
  amazonPartnerTagOverride: string | null;
};

/**
 * Effective tag: DB row missing, or column SQL NULL → env. Non-null column → trimmed string (may be "").
 */
export function resolvePartnerTagFromSettings(
  row: SiteSettingsPartnerTagRow | undefined,
  envTag: string,
): string {
  if (!row) return envTag;
  const v = row.amazonPartnerTagOverride;
  if (v === null) return envTag;
  return v.trim();
}

/**
 * Value to persist after PATCH: `null` clears override. Trimmed string equal to env → `null` (no redundant override).
 */
export function partnerTagValueToStore(parsed: string | null, envTag: string): string | null {
  if (parsed === null) return null;
  const t = parsed.trim();
  if (t === envTag.trim()) return null;
  return t;
}

export function marketplaceHostForRetag(storedAffiliateUrl: string, fallbackHost: string): string {
  try {
    const u = new URL(storedAffiliateUrl);
    if (u.protocol === "http:" || u.protocol === "https:") {
      return normalizeMarketplaceHost(u.hostname);
    }
  } catch {
    /* keep fallback */
  }
  return normalizeMarketplaceHost(fallbackHost);
}

export function computeRetaggedAffiliateUrl(
  asin: string,
  storedAffiliateUrl: string,
  partnerTag: string,
  fallbackHost: string,
): string {
  const host = marketplaceHostForRetag(storedAffiliateUrl, fallbackHost);
  return buildCleanAffiliateUrl(asin, host, partnerTag);
}
