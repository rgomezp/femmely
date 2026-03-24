import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { outfitItems, siteSettings } from "@/lib/db/schema";
import { computeRetaggedAffiliateUrl, resolvePartnerTagFromSettings } from "@/lib/partner-tag";
import { isMissingSiteSettingsTableError } from "@/lib/site-settings-errors";

const SITE_SETTINGS_ID = 1 as const;

async function selectSiteSettingsRow() {
  try {
    return await db.select().from(siteSettings).where(eq(siteSettings.id, SITE_SETTINGS_ID)).limit(1);
  } catch (e) {
    if (isMissingSiteSettingsTableError(e)) {
      console.warn(
        "[site-settings] Table site_settings is missing. Run `yarn db:push` (or apply migration 0003_site_settings.sql). Using env-only partner tag until then.",
      );
      return [];
    }
    throw e;
  }
}

export function getAmazonPartnerTagEnv(): string {
  return process.env.AMAZON_PARTNER_TAG?.trim() ?? "";
}

/** Raw DB value: `null` if no row or column is SQL NULL (inherit env). Empty string is explicit “no tag”. */
export async function getAmazonPartnerTagOverrideRaw(): Promise<string | null> {
  const rows = await selectSiteSettingsRow();
  if (!rows[0]) return null;
  return rows[0].amazonPartnerTagOverride;
}

export async function getAmazonPartnerTagResolved(): Promise<string> {
  const rows = await selectSiteSettingsRow();
  return resolvePartnerTagFromSettings(rows[0], getAmazonPartnerTagEnv());
}

/**
 * Persists override. Pass `null` to clear override (use env only).
 * Pass `""` to store an explicit empty tag (no `tag=` on built URLs).
 */
export async function setAmazonPartnerTagOverride(value: string | null): Promise<void> {
  try {
    await db
      .insert(siteSettings)
      .values({ id: SITE_SETTINGS_ID, amazonPartnerTagOverride: value })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { amazonPartnerTagOverride: value },
      });
  } catch (e) {
    if (isMissingSiteSettingsTableError(e)) {
      throw new Error(
        'Database table "site_settings" is missing. Apply the schema (e.g. run `yarn db:push` locally with DATABASE_URL set, or run migration 0003_site_settings.sql on your database).',
      );
    }
    throw e;
  }
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

  // neon-http driver does not support db.transaction(); run sequential updates.
  for (const row of rows) {
    const url = computeRetaggedAffiliateUrl(row.asin, row.affiliateUrl, partnerTag, fallbackHost);
    await db.update(outfitItems).set({ affiliateUrl: url }).where(eq(outfitItems.id, row.id));
  }

  return rows.length;
}
