/** True when Postgres reports the `site_settings` relation is missing (migration / db:push not applied). */
export function isMissingSiteSettingsTableError(e: unknown): boolean {
  const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code: unknown }).code) : "";
  if (code === "42P01") return true;
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("site_settings") && /does not exist|n'existe pas|42P01/i.test(msg);
}
