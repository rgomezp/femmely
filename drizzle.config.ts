import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit runs outside Next.js — it does not load .env or .env.local.
 * Load both (same order as Next: .env then .env.local so local overrides).
 */
function loadEnvFiles() {
  for (const name of [".env", ".env.local"]) {
    const p = resolve(process.cwd(), name);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key) process.env[key] = val;
    }
  }
}

loadEnvFiles();

if (!process.env.DATABASE_URL?.trim()) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env.local (see .env.example). drizzle-kit loads .env and .env.local automatically.",
  );
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
