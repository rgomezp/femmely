import slugify from "slugify";

export function slugifyTitle(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

export function formatPrice(cents: number | null | undefined, currency = "USD"): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Origin for canonical URLs, Open Graph, sitemap, and JSON-LD.
 * Mobile Safari (and some other browsers) use the canonical URL for the system share sheet,
 * so this must not fall back to localhost on Vercel when NEXTAUTH_URL is missing.
 */
export function siteUrl(): string {
  const trimBase = (v: string | undefined) => {
    const t = v?.trim();
    return t ? t.replace(/\/$/, "") : "";
  };

  const explicit = trimBase(process.env.SITE_URL) || trimBase(process.env.NEXTAUTH_URL);
  if (explicit) return explicit;

  const vercel = trimBase(process.env.VERCEL_URL);
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = siteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
