import "server-only";
import {
  ApiClient,
  GetItemsRequestContent,
  GetItemsResource,
  TypedDefaultApi,
} from "amazon-creators-api";
import { unstable_cache } from "next/cache";
import { getAmazonPartnerTagResolved } from "@/lib/site-settings";

export type LiveAmazonProduct = {
  asin: string;
  title: string;
  imageUrl: string | null;
  priceCents: number | null;
  currency: string;
  detailUrl: string;
  affiliateUrl: string;
  availability: string | null;
};

function marketplaceHost(): string {
  return process.env.AMAZON_MARKETPLACE?.trim() || "www.amazon.com";
}

async function withAffiliateTag(url: string, asin: string): Promise<string> {
  const tag = await getAmazonPartnerTagResolved();
  if (!tag) {
    return url || `https://www.amazon.com/dp/${asin}`;
  }
  try {
    const u = new URL(url || `https://www.amazon.com/dp/${asin}`);
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(tag)}`;
  }
}

function creatorsApiClient(): TypedDefaultApi {
  const apiClient = new ApiClient();
  apiClient.credentialId = process.env.AMAZON_CREDENTIAL_ID!;
  apiClient.credentialSecret = process.env.AMAZON_CREDENTIAL_SECRET!;
  apiClient.version = process.env.AMAZON_CREDENTIAL_VERSION!;
  return new TypedDefaultApi(apiClient);
}

/** API credentials only (no partner tag check). */
export function amazonCreatorsCredentialsConfigured(): boolean {
  return Boolean(
    process.env.AMAZON_CREDENTIAL_ID?.trim() &&
      process.env.AMAZON_CREDENTIAL_SECRET?.trim() &&
      process.env.AMAZON_CREDENTIAL_VERSION?.trim(),
  );
}

/** Credentials plus a non-empty resolved Associates partner tag (env or DB override). */
export async function amazonConfigured(): Promise<boolean> {
  if (!amazonCreatorsCredentialsConfigured()) return false;
  const tag = await getAmazonPartnerTagResolved();
  return tag.length > 0;
}

const GET_ITEM_RESOURCES = [
  "images.primary.large",
  "images.primary.medium",
  "itemInfo.title",
  "offersV2.listings.price",
  "offersV2.listings.availability",
].map((r) => GetItemsResource.constructFromObject(r));

export async function fetchAmazonItem(asin: string): Promise<LiveAmazonProduct | null> {
  if (!(await amazonConfigured())) return null;

  const tag = await getAmazonPartnerTagResolved();
  const api = creatorsApiClient();
  const req = new GetItemsRequestContent(tag, [asin.toUpperCase()]);
  req.resources = GET_ITEM_RESOURCES;

  const response = await api.getItems(marketplaceHost(), req);
  const items = response.itemsResult?.items;
  if (!items?.length) return null;

  const item = items[0];
  const resolvedAsin = item.asin ?? asin;
  const title =
    item.itemInfo?.title?.displayValue ?? `Amazon product ${resolvedAsin}`;

  const primary = item.images?.primary;
  const imageUrl =
    primary?.large?.url ??
    primary?.medium?.url ??
    primary?.hiRes?.url ??
    null;

  const listing = item.offersV2?.listings?.[0];
  const money = listing?.price?.money;
  const amount = money?.amount;
  const priceCents =
    typeof amount === "number" ? Math.round(amount * 100) : null;
  const currency = money?.currency ?? "USD";

  const detailUrl =
    item.detailPageURL?.trim() || `https://www.amazon.com/dp/${resolvedAsin}`;

  return {
    asin: resolvedAsin,
    title,
    imageUrl,
    priceCents,
    currency,
    detailUrl,
    affiliateUrl: await withAffiliateTag(detailUrl, resolvedAsin),
    availability: listing?.availability?.message ?? null,
  };
}

export function getCachedAmazonItem(asin: string) {
  return unstable_cache(
    async () => fetchAmazonItem(asin),
    ["creators-api-get-item", asin],
    { revalidate: 3600 },
  )();
}
