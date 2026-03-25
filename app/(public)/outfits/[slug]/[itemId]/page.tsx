import Link from "next/link";
import type { Metadata } from "next";
import { ItemDetail } from "@/components/public/ItemDetail";
import { getCachedAmazonItem } from "@/lib/amazon";
import { mergeItemDisplay } from "@/lib/merge-product";
import { getPublishedOutfitItemBySlugAndId, getPublishedOutfitItemRoutes } from "@/lib/queries";
import { probeImageDimensionsForOg, resolveShareImageUrl } from "@/lib/og-share-image";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string; itemId: string }> };

export async function generateStaticParams() {
  try {
    const routes = await getPublishedOutfitItemRoutes();
    return routes.map(({ slug, itemId }) => ({ slug, itemId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, itemId } = await params;
  try {
    const row = await getPublishedOutfitItemBySlugAndId(slug, itemId);
    if (!row) return { title: "Item not found" };
    const { outfit, item } = row;
    const live = await getCachedAmazonItem(item.asin);
    const display = mergeItemDisplay(item, live);
    const title = `${display.title} · ${outfit.title}`;
    const description =
      `${display.title} from the ${outfit.title} board on Femmely.`.slice(0, 160);
    const rawImage = display.primaryImageUrl?.trim() || undefined;
    const ogImageUrl = rawImage ? resolveShareImageUrl(rawImage) : undefined;
    const ogDims = ogImageUrl ? await probeImageDimensionsForOg(ogImageUrl) : undefined;
    const url = absoluteUrl(`/outfits/${slug}/${itemId}`);
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: ogImageUrl
          ? [{ url: ogImageUrl, alt: display.title, ...ogDims }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImageUrl ? [ogImageUrl] : undefined,
      },
    };
  } catch {
    return { title: "Item" };
  }
}

export default async function OutfitItemPage({ params }: Props) {
  const { slug, itemId } = await params;
  let row: Awaited<ReturnType<typeof getPublishedOutfitItemBySlugAndId>> = null;
  try {
    row = await getPublishedOutfitItemBySlugAndId(slug, itemId);
  } catch {
    /* DB unavailable */
  }
  if (!row) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Item not found</h1>
        <Link href={`/outfits/${slug}`} className="mt-4 inline-block font-body text-primary transition-opacity hover:opacity-80">
          Back to outfit
        </Link>
      </div>
    );
  }

  const live = await getCachedAmazonItem(row.item.asin);
  const display = mergeItemDisplay(row.item, live);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: display.title,
    image: display.primaryImageUrl,
    description: `${display.title} from the ${row.outfit.title} board on Femmely.`,
    offers: display.priceCents
      ? {
          "@type": "Offer",
          priceCurrency: display.currency,
          price: (display.priceCents / 100).toFixed(2),
          url: display.affiliateUrl,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <ItemDetail outfitTitle={row.outfit.title} outfitSlug={slug} item={display} />
    </>
  );
}
