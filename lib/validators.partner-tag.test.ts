import { describe, expect, it } from "vitest";
import { adminSiteSettingsPatchSchema } from "./validators";

describe("adminSiteSettingsPatchSchema", () => {
  it("accepts null override and optional bulk flag", () => {
    const r = adminSiteSettingsPatchSchema.safeParse({
      amazonPartnerTagOverride: null,
      bulkRetagAffiliateUrls: true,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.amazonPartnerTagOverride).toBeNull();
      expect(r.data.bulkRetagAffiliateUrls).toBe(true);
    }
  });

  it("accepts string override up to 64 chars", () => {
    const tag = "a".repeat(64);
    const r = adminSiteSettingsPatchSchema.safeParse({ amazonPartnerTagOverride: tag });
    expect(r.success).toBe(true);
  });

  it("rejects tag longer than 64 chars", () => {
    const r = adminSiteSettingsPatchSchema.safeParse({ amazonPartnerTagOverride: "x".repeat(65) });
    expect(r.success).toBe(false);
  });

  it("accepts empty string override", () => {
    const r = adminSiteSettingsPatchSchema.safeParse({ amazonPartnerTagOverride: "" });
    expect(r.success).toBe(true);
  });

  it("omitted bulk flag is undefined", () => {
    const r = adminSiteSettingsPatchSchema.safeParse({ amazonPartnerTagOverride: null });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.bulkRetagAffiliateUrls).toBeUndefined();
  });
});
