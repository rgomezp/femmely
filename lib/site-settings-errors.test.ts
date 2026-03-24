import { describe, expect, it } from "vitest";
import { isMissingSiteSettingsTableError } from "./site-settings-errors";

describe("isMissingSiteSettingsTableError", () => {
  it("detects Postgres undefined_table code", () => {
    expect(isMissingSiteSettingsTableError({ code: "42P01" })).toBe(true);
  });

  it("detects Neon-style message for site_settings", () => {
    expect(
      isMissingSiteSettingsTableError(
        new Error('relation "site_settings" does not exist'),
      ),
    ).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isMissingSiteSettingsTableError(new Error("connection refused"))).toBe(false);
  });
});
