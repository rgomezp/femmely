# Femmely.club

Masonry-style outfit boards with Amazon Creators API product data, Vercel Postgres + Drizzle, Vercel Blob uploads, NextAuth v5 (credentials), and static men’s → women’s sizing tools.

## Prerequisites

- Node 20+
- [Yarn 1.22](https://classic.yarnpkg.com/) (see `packageManager` in `package.json`)
- Vercel Postgres (Neon) database
- Optional: Vercel Blob, Amazon Creators API credentials for live product lookup

## Setup

1. **Clone and install**

   ```bash
   yarn install
   ```

2. **Environment** — copy [`.env.example`](.env.example) to `.env.local` and fill values.

3. **Database** — push the Drizzle schema:

   ```bash
   yarn db:push
   ```

   (`drizzle.config.ts` loads `.env` then `.env.local`, so `DATABASE_URL` is picked up the same way as Next.js.)

   After pulling changes that add tables (e.g. `site_settings`), run `yarn db:push` again so production and local DBs stay in sync.

4. **Admin password** — Next.js expands `$VAR` inside `.env` values. Bcrypt hashes look like `$2a$10$…`, so a plain `ADMIN_PASSWORD_HASH` is often **corrupted** and login always fails. **Use base64** (recommended):

   ```bash
   yarn admin:hash-b64 your-password
   ```

   Copy the printed `ADMIN_PASSWORD_HASH_B64=…` line into `.env.local` and clear `ADMIN_PASSWORD_HASH` if it was set.

   Alternative: put the raw hash in `.env.local` with **every** `$` escaped as `\$` (e.g. `\$2a\$10\$…`).

5. **Run dev**

   ```bash
   yarn dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (sign in at `/admin/login`)

### Development: “hot reload” vs full refresh

- **Server Components** (default `page.tsx` / most layouts): saving a file re-runs the server render; the browser often **refreshes the route**. That’s normal—you usually **do not** need to restart `yarn dev`.
- **Client components** (`"use client"`): **Fast Refresh** can update the UI without a full document reload and preserves more client state.
- **Restart `yarn dev` only when** you change `next.config.ts`, `.env*` files, or add/change dependencies.
- If you see missing webpack chunks (e.g. `Cannot find module './1234.js'`), stop dev, run `rm -rf .next`, then `yarn dev` again.
- Prefer `yarn dev` over `yarn dev:turbo` if Turbopack acts flaky (see scripts table below).

## Yarn scripts

| Command        | Description                |
| -------------- | -------------------------- |
| `yarn dev`     | Next.js dev (webpack; stable) |
| `yarn dev:turbo` | Next.js dev with Turbopack (faster; occasional cache/manifest glitches) |
| `yarn build`   | Production build (webpack) |
| `yarn start`   | Start production server    |
| `yarn lint`    | ESLint                     |
| `yarn db:push` | Apply schema (`drizzle-kit push`) |
| `yarn db:push:force` | Same, auto-approve data-loss steps (e.g. dropping columns; use when the CLI can’t prompt) |
| `yarn db:generate` | Generate SQL migrations   |
| `yarn db:studio`   | Drizzle Studio            |
| `yarn admin:hash-b64 <pwd>` | Base64 bcrypt hash for `ADMIN_PASSWORD_HASH_B64` |

## Vercel deployment

1. Connect the Git repo to Vercel.
2. Create **Vercel Postgres** and **Blob** (optional but recommended for uploads).
3. Set all env vars from `.env.example` in the Vercel project (including `NEXTAUTH_URL` = `https://femmely.club` or your domain). Use **`ADMIN_PASSWORD_HASH_B64`** for production too so the hash is not mangled by `$` expansion.
4. Run `yarn db:push` against production `DATABASE_URL` once (locally with prod URL or via Vercel CLI).
5. Add your **Vercel Blob** host to [`next.config.ts`](next.config.ts) under `images.remotePatterns` if `next/image` should optimize board photo uploads (pattern depends on your blob hostname).

## Amazon Creators API

PA-API 5 is being retired; new integrations use the [Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction). You only need these variables for ASIN lookup in the admin and for refreshing live title, image, and price on public pages.

Register in [Associates / Creators API onboarding](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding/register-for-creators-api), then set:

```sh
AMAZON_CREDENTIAL_ID=...
AMAZON_CREDENTIAL_SECRET=...
AMAZON_CREDENTIAL_VERSION=...
AMAZON_PARTNER_TAG=yourstore-20
AMAZON_MARKETPLACE=www.amazon.com
```

`AMAZON_MARKETPLACE` is the product site hostname for `GetItems` (see Amazon’s marketplace reference in their API docs).

**Bootstrap without API access:** Associates may need qualifying sales before Creators API credentials work. You can still run the site: leave the `AMAZON_CREDENTIAL_*` variables unset, and in the admin outfit editor use **Add item manually**, then paste ASIN, title, an Amazon product image URL, and your tagged affiliate link. Public pages use that stored data; when the API is available later, live title, image, and price can refresh automatically.

Detailed setup once you qualify for API access: [`docs/amazon-creators-api-setup.md`](docs/amazon-creators-api-setup.md).

## Project map

- **Public routes** — `app/(public)/` (home, outfits, categories, tags, size guide, legal).
- **Admin** — `app/admin/(dashboard)/` (protected); login at `app/admin/login/`.
- **API** — `app/api/` (public read APIs + `app/api/admin/*`).
- **DB** — `lib/db/schema.ts`, migrations in `lib/db/migrations/`. Each **outfit** has a single admin-uploaded **`main_image_url`** (Blob) for masonry cards; **items** store Amazon `image_url` only (sidebar + item detail).
- **Sizing data** — `lib/sizing/` (typed static converters).
- **Amazon** — `lib/amazon.ts` (Creators API `GetItems` via [`amazon-creators-api`](https://www.npmjs.com/package/amazon-creators-api)).

## Compliance notes

- Affiliate disclosure component: [`components/public/AffiliateDisclosure.tsx`](components/public/AffiliateDisclosure.tsx).
- Product images on outfit pages are refreshed via the Creators API where configured; DB `image_url` is fallback.
- `robots.txt` disallows `/admin` and `/api/admin` via [`app/robots.ts`](app/robots.ts).
