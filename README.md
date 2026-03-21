# Femmely.club

Pinterest-style fashion discovery with Amazon PA-API product data, Vercel Postgres + Drizzle, Vercel Blob uploads, NextAuth v5 (credentials), and static men’s → women’s sizing tools.

## Prerequisites

- Node 20+
- [Yarn 1.22](https://classic.yarnpkg.com/) (see `packageManager` in `package.json`)
- Vercel Postgres (Neon) database
- Optional: Vercel Blob, Amazon PA-API credentials for live product lookup

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

   (Uses `DATABASE_URL` from `.env.local`.)

4. **Admin password** — generate a bcrypt hash and set `ADMIN_PASSWORD_HASH`:

   ```bash
   node -e "const b=require('bcryptjs');console.log(b.hashSync('your-password',10))"
   ```

5. **Run dev**

   ```bash
   yarn dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (sign in at `/admin/login`)

## Yarn scripts

| Command        | Description                |
| -------------- | -------------------------- |
| `yarn dev`     | Next.js dev (Turbopack)    |
| `yarn build`   | Production build (webpack) |
| `yarn start`   | Start production server    |
| `yarn lint`    | ESLint                     |
| `yarn db:push` | Apply schema (`drizzle-kit push`) |
| `yarn db:generate` | Generate SQL migrations   |
| `yarn db:studio`   | Drizzle Studio            |

## Vercel deployment

1. Connect the Git repo to Vercel.
2. Create **Vercel Postgres** and **Blob** (optional but recommended for uploads).
3. Set all env vars from `.env.example` in the Vercel project (including `NEXTAUTH_URL` = `https://femmely.club` or your domain).
4. Run `yarn db:push` against production `DATABASE_URL` once (locally with prod URL or via Vercel CLI).
5. Add your **Vercel Blob** host to [`next.config.ts`](next.config.ts) under `images.remotePatterns` if `next/image` should optimize hero uploads (pattern depends on your blob hostname).

## Project map

- **Public routes** — `app/(public)/` (home, outfits, categories, tags, size guide, legal).
- **Admin** — `app/admin/(dashboard)/` (protected); login at `app/admin/login/`.
- **API** — `app/api/` (public read APIs + `app/api/admin/*`).
- **DB** — `lib/db/schema.ts`, migrations in `lib/db/migrations/`.
- **Sizing data** — `lib/sizing/` (typed static converters).
- **Amazon** — `lib/amazon.ts` (PA-API 5 `GetItems`); `paapi5-nodejs-sdk` is listed in `serverExternalPackages` for compatibility with `next build`.

## Compliance notes

- Affiliate disclosure component: [`components/public/AffiliateDisclosure.tsx`](components/public/AffiliateDisclosure.tsx).
- Product images on outfit pages are refreshed via PA-API where configured; DB `image_url` is fallback.
- `robots.txt` disallows `/admin` and `/api/admin` via [`app/robots.ts`](app/robots.ts).
