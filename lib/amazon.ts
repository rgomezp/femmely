import "server-only";
import { unstable_cache } from "next/cache";

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

function partnerTag(): string {
  return process.env.AMAZON_PARTNER_TAG?.trim() || "";
}

function withAffiliateTag(url: string, asin: string): string {
  const tag = partnerTag();
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

function getSdk(): Record<string, unknown> {
  // paapi5-nodejs-sdk is CommonJS
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("paapi5-nodejs-sdk") as Record<string, unknown>;
}

export function amazonConfigured(): boolean {
  return Boolean(
    process.env.AMAZON_ACCESS_KEY &&
      process.env.AMAZON_SECRET_KEY &&
      process.env.AMAZON_PARTNER_TAG,
  );
}

export async function fetchAmazonItem(asin: string): Promise<LiveAmazonProduct | null> {
  if (!amazonConfigured()) return null;

  const ProductAdvertisingAPIv1 = getSdk() as {
    ApiClient: { instance: Record<string, string> };
    DefaultApi: new () => {
      getItems: (
        req: unknown,
        cb: (err: unknown, data: unknown) => void,
      ) => void;
    };
    GetItemsRequest: new () => Record<string, unknown>;
    GetItemsResponse: { constructFromObject: (data: unknown) => PaapiItemsResponse };
  };

  const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
  defaultClient.accessKey = process.env.AMAZON_ACCESS_KEY!;
  defaultClient.secretKey = process.env.AMAZON_SECRET_KEY!;
  defaultClient.host = process.env.AMAZON_HOST || "webservices.amazon.com";
  defaultClient.region = process.env.AMAZON_REGION || "us-east-1";

  const api = new ProductAdvertisingAPIv1.DefaultApi();
  const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();
  getItemsRequest.PartnerTag = partnerTag();
  getItemsRequest.PartnerType = "Associates";
  getItemsRequest.ItemIds = [asin];
  getItemsRequest.Condition = "New";
  getItemsRequest.Resources = [
    "Images.Primary.Large",
    "ItemInfo.Title",
    "Offers.Listings.Price",
    "Offers.Listings.Availability.Message",
  ];

  const data = await new Promise<unknown>((resolve, reject) => {
    api.getItems(getItemsRequest, (err: unknown, res: unknown) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

  const parsed = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data) as PaapiItemsResponse;
  const items = parsed.ItemsResult?.Items;
  if (!items?.length) return null;

  const item = items[0];
  const title =
    item.ItemInfo?.Title?.DisplayValue ?? `Amazon product ${item.ASIN ?? asin}`;
  const imageUrl =
    item.Images?.Primary?.Large?.URL ??
    item.Images?.Primary?.Medium?.URL ??
    null;
  const listing = item.Offers?.Listings?.[0];
  const priceAmount = listing?.Price?.Amount;
  const priceCents =
    typeof priceAmount === "number"
      ? Math.round(priceAmount * 100)
      : listing?.Price?.Amount == null
        ? null
        : Math.round(Number(listing.Price.Amount) * 100);
  const currency = listing?.Price?.Currency ?? "USD";
  const detailUrl = item.DetailPageURL ?? `https://www.amazon.com/dp/${asin}`;

  return {
    asin: item.ASIN ?? asin,
    title,
    imageUrl,
    priceCents,
    currency,
    detailUrl,
    affiliateUrl: withAffiliateTag(detailUrl, asin),
    availability: listing?.Availability?.Message ?? null,
  };
}

type PaapiItemsResponse = {
  ItemsResult?: {
    Items?: PaapiItem[];
  };
};

export function getCachedAmazonItem(asin: string) {
  return unstable_cache(
    async () => fetchAmazonItem(asin),
    ["paapi-get-item", asin],
    { revalidate: 3600 },
  )();
}

type PaapiItem = {
  ASIN?: string;
  DetailPageURL?: string;
  ItemInfo?: { Title?: { DisplayValue?: string } };
  Images?: { Primary?: { Large?: { URL?: string }; Medium?: { URL?: string } } };
  Offers?: {
    Listings?: Array<{
      Price?: { Amount?: number; Currency?: string };
      Availability?: { Message?: string };
    }>;
  };
};
