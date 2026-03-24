/**
 * Parse Amazon retail product URLs and build clean affiliate links (query stripped; optional Associates tag only).
 * Used in admin outfit flow — safe to import from client components.
 */

function isAmazonRetailHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (!h.includes("amazon.")) return false;
  if (h.includes("aws.amazon") || h.includes("advertising.amazon") || h.includes("affiliate-program.amazon")) {
    return false;
  }
  return true;
}

/** Extract ASIN from product path segments like /dp/ASIN, /gp/product/ASIN, /.../dp/ASIN/ */
export function extractAsinFromAmazonPath(pathname: string): string | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  const dp = p.match(/\/dp\/([A-Z0-9]{10})(?:\/|$)/i);
  if (dp?.[1]) return dp[1].toUpperCase();
  const gp = p.match(/\/gp\/product\/([A-Z0-9]{10})(?:\/|$)/i);
  if (gp?.[1]) return gp[1].toUpperCase();
  const ob = p.match(/\/exec\/obidos\/ASIN\/detail\/([A-Z0-9]{10})(?:\/|$)/i);
  if (ob?.[1]) return ob[1].toUpperCase();
  return null;
}

export function normalizeMarketplaceHost(hostname: string): string {
  const h = hostname
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]!;
  if (h === "smile.amazon.com") return "www.amazon.com";
  return h.startsWith("www.") ? h : `www.${h}`;
}

export function extractAsinFromAmazonUrl(input: string): { asin: string; marketplaceHost: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  if (!isAmazonRetailHost(url.hostname)) return null;
  const asin = extractAsinFromAmazonPath(url.pathname);
  if (!asin) return null;
  return { asin, marketplaceHost: normalizeMarketplaceHost(url.hostname) };
}

/** Plain ASIN only (10 alphanumeric). */
export function looksLikeRawAsin(input: string): string | null {
  const t = input.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(t)) return null;
  return t;
}

/**
 * Canonical product URL: https://{host}/dp/{ASIN}?tag= only when partnerTag is set.
 * Strips all Amazon tracking/query noise from pasted URLs.
 */
export function buildCleanAffiliateUrl(
  asin: string,
  marketplaceHost: string,
  partnerTag?: string,
): string {
  const host = normalizeMarketplaceHost(marketplaceHost);
  const u = new URL(`https://${host}/dp/${asin.toUpperCase()}`);
  const tag = partnerTag?.trim();
  if (tag) u.searchParams.set("tag", tag);
  return u.toString();
}

export type ParseAmazonInputResult =
  | { ok: true; asin: string; affiliateUrl: string }
  | { ok: false; error: string };

/**
 * Accepts a full Amazon URL, or a bare ASIN; uses defaultMarketplaceHost for ASIN-only (e.g. www.amazon.com).
 */
export function parseAmazonProductInput(
  raw: string,
  opts: { partnerTag?: string; defaultMarketplaceHost?: string },
): ParseAmazonInputResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Paste a link or ASIN." };

  const bare = looksLikeRawAsin(trimmed);
  if (bare) {
    const host = normalizeMarketplaceHost(opts.defaultMarketplaceHost || "www.amazon.com");
    return {
      ok: true,
      asin: bare,
      affiliateUrl: buildCleanAffiliateUrl(bare, host, opts.partnerTag),
    };
  }

  const parsed = extractAsinFromAmazonUrl(trimmed);
  if (!parsed) {
    return {
      ok: false,
      error: "Could not find a product ASIN. Use a link that contains /dp/… or /gp/product/…, or paste a 10-character ASIN.",
    };
  }
  return {
    ok: true,
    asin: parsed.asin,
    affiliateUrl: buildCleanAffiliateUrl(parsed.asin, parsed.marketplaceHost, opts.partnerTag),
  };
}
