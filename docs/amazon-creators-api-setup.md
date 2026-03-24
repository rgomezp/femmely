# Amazon Creators API setup (live product data)

This project uses the **Amazon Creators API** for admin ASIN lookup and for refreshing title, image, and price on public outfit pages. Product Advertising API (PA-API) is being retired; new integrations use Creators API.

Official references:

- [Creators API introduction](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction)
- [Register for Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding/register-for-creators-api)
- [Using the SDK](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/get-started/using-sdk)

## Prerequisites (Amazon’s rules)

Amazon may require, among other things:

- Enrollment in the **Amazon Associates** program for your target marketplace.
- **Qualifying sales** within a recent window (for example, documentation has cited a minimum number of sales in the last 30 days) before API access is granted.
- Registration for API access in **Associates Central** and generated **API credentials** (credential ID, secret, and version — not the old PA-API access keys).

Check the current terms in Associates Central and the links above; eligibility changes over time.

## What works without the API

You do **not** need Creators API credentials to run the site:

- Set **`AMAZON_PARTNER_TAG`** so the admin “From Amazon link or ASIN” tool and stored links can use your Associates tag.
- Add products by pasting Amazon URLs or ASINs, then fill **title** and **image URL** manually until the API is available.

When credentials are added later, live metadata refresh turns on automatically for configured environments.

## Environment variables

Add these to `.env.local` (and to your Vercel project for production):

| Variable | Purpose |
|----------|---------|
| `AMAZON_CREDENTIAL_ID` | From Creators API registration |
| `AMAZON_CREDENTIAL_SECRET` | From Creators API registration |
| `AMAZON_CREDENTIAL_VERSION` | Version string shown with your credentials |
| `AMAZON_PARTNER_TAG` | Your Associates store / tracking ID (e.g. `yoursite-20`) |
| `AMAZON_MARKETPLACE` | Product site hostname for `GetItems` (US: `www.amazon.com`) |

See the root `.env.example` for a template.

After changing env vars, restart the Next.js dev server locally. On Vercel, redeploy so serverless functions pick up new values.

## Verify configuration

1. Sign in to the admin and open **Settings**.
2. Confirm **Amazon Creators API** shows as **Configured** when all credential variables and `AMAZON_PARTNER_TAG` are set.
3. In an outfit, step **Items**, use **Lookup** with a valid ASIN. If the account meets Amazon’s requirements, you should get title, image, and price back.

## Offers and `OffersV2`

The integration requests **`offersV2`** resources (price, availability), not the deprecated `Offers` block. If Amazon returns errors for pricing scopes, check their docs for your account and requested resources.

## Compliance

Keep your **affiliate disclosure** accurate and follow Amazon Associates Program Operating Agreement and FTC guidance. Product links should use your approved tracking ID where required.
