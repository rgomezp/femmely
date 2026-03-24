import { describe, expect, it } from "vitest";
import {
  computeRetaggedAffiliateUrl,
  marketplaceHostForRetag,
  partnerTagValueToStore,
  resolvePartnerTagFromSettings,
} from "./partner-tag";

describe("resolvePartnerTagFromSettings", () => {
  it("uses env when row is missing", () => {
    expect(resolvePartnerTagFromSettings(undefined, "envtag-20")).toBe("envtag-20");
  });

  it("uses env when override column is SQL null", () => {
    expect(resolvePartnerTagFromSettings({ amazonPartnerTagOverride: null }, "envtag-20")).toBe("envtag-20");
  });

  it("uses trimmed override when set", () => {
    expect(resolvePartnerTagFromSettings({ amazonPartnerTagOverride: "  dbtag-20  " }, "envtag-20")).toBe(
      "dbtag-20",
    );
  });

  it("allows explicit empty tag when stored as empty string", () => {
    expect(resolvePartnerTagFromSettings({ amazonPartnerTagOverride: "" }, "envtag-20")).toBe("");
  });
});

describe("partnerTagValueToStore", () => {
  it("returns null for null (clear override)", () => {
    expect(partnerTagValueToStore(null, "foo-20")).toBeNull();
  });

  it("returns null when trimmed value equals env (redundant override)", () => {
    expect(partnerTagValueToStore("  foo-20  ", "foo-20")).toBeNull();
  });

  it("returns trimmed custom tag", () => {
    expect(partnerTagValueToStore("  bar-20  ", "foo-20")).toBe("bar-20");
  });

  it("stores empty string when different from env", () => {
    expect(partnerTagValueToStore("", "foo-20")).toBe("");
  });

  it("returns null when both empty", () => {
    expect(partnerTagValueToStore("", "")).toBeNull();
  });
});

describe("marketplaceHostForRetag", () => {
  it("parses host from stored https Amazon URL", () => {
    expect(
      marketplaceHostForRetag(
        "https://www.amazon.co.uk/dp/B012345678?tag=old-20&ref=xx",
        "www.amazon.com",
      ),
    ).toBe("www.amazon.co.uk");
  });

  it("uses fallback when URL is invalid", () => {
    expect(marketplaceHostForRetag("not-a-url", "amazon.ca")).toBe("www.amazon.ca");
  });
});

describe("computeRetaggedAffiliateUrl", () => {
  it("builds clean dp URL with new tag and preserved marketplace", () => {
    const url = computeRetaggedAffiliateUrl(
      "B0ABCDEFGH",
      "https://www.amazon.de/dp/B0ABCDEFGH?tag=old-20&foo=1",
      "newtag-20",
      "www.amazon.com",
    );
    expect(url).toBe("https://www.amazon.de/dp/B0ABCDEFGH?tag=newtag-20");
  });

  it("omits tag param when partner tag is empty", () => {
    const url = computeRetaggedAffiliateUrl(
      "B0ABCDEFGH",
      "https://www.amazon.com/dp/B0ABCDEFGH?tag=old-20",
      "",
      "www.amazon.com",
    );
    expect(url).toBe("https://www.amazon.com/dp/B0ABCDEFGH");
  });
});
