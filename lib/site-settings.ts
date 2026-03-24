import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { outfitItems, siteSettings } from "@/lib/db/schema";
import { computeRetaggedAffiliateUrl, resolvePartnerTagFromSettings } from "@/lib/partner-tag";

const SITE_SETTINGS_ID = 1 as const;

export function getAmazonPartnerTagEnv(): string {
  return process.env.AMAZON_PARTNER_TAG?.trim() ?? "";
}

/** Raw DB value: `null` if no row or column is SQL NULL (inherit env). Empty string is explicit “no tag”. */
export async function getAmazonPartnerTagOverrideRaw(): Promise<string | null> {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, SITE_SETTINGS_ID)).limit(1);
  if (!rows[0]) return null;
  return rows[0].amazonPartnerTagOverride;
}

export async function getAmazonPartnerTagResolved(): Promise<string> {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, SITE_SETTINGS_ID)).limit(1);
  return resolvePartnerTagFromSettings(rows[0], getAmazonPartnerTagEnv());
}

/**
 * Persists override. Pass `null` to clear override (use env only).
 * Pass `""` to store an explicit empty tag (no `tag=` on built URLs).
 */
export async function setAmazonPartnerTagOverride(value: string | null): Promise<void> {
  await db
    .insert(siteSettings)
    .values({ id: SITE_SETTINGS_ID, amazonPartnerTagOverride: value })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { amazonPartnerTagOverride: value },
    });
}

export async function bulkRetagOutfitItemAffiliateUrls(partnerTag: string): Promise<number> {
  const fallbackHost = process.env.AMAZON_MARKETPLACE?.trim() || "www.amazon.com";
  const rows = await db
    .select({
      id: outfitItems.id,
      asin: outfitItems.asin,
      affiliateUrl: outfitItems.affiliateUrl,
    })
    .from(outfitItems);

  await db.transaction(async (tx) => {
    for (const row of rows) {
      const url = computeRetaggedAffiliateUrl(row.asin, row.affiliateUrl, partnerTag, fallbackHost);
      await tx.update(outfitItems).set({ affiliateUrl: url }).where(eq(outfitItems.id, row.id));
    }
  });

  return rows.length;
}
