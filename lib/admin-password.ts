/**
 * Next.js loads `.env*` with variable expansion: `$foo` is replaced.
 * Bcrypt hashes look like `$2a$10$...`, so raw `ADMIN_PASSWORD_HASH=...` is often mangled.
 * Prefer `ADMIN_PASSWORD_HASH_B64` (base64 of the UTF-8 hash string), or escape each `$` as `\$`.
 */
export function adminPasswordHashFromEnv(): string | undefined {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf8").trim();
    } catch {
      return undefined;
    }
  }
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!raw) return undefined;
  return raw.replace(/\\\$/g, "$");
}
