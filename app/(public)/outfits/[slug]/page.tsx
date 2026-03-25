import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AffiliateDisclosure } from "@/components/public/AffiliateDisclosure";
import { BookmarkButton } from "@/components/public/BookmarkButton";
import { FeaturedOutfitsCarousel } from "@/components/public/FeaturedOutfitsCarousel";
import { OutfitCard } from "@/components/public/OutfitCard";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitItemRowCard } from "@/components/public/OutfitItemRowCard";
import { getCachedAmazonItem } from "@/lib/amazon";
import { mergeItemDisplay } from "@/lib/merge-product";
import {
  getOutfitCategories,
  getOutfitItems,
  getOutfitTags,
  getPublishedOutfitBySlug,
  getPublishedOutfitSlugs,
  getRelatedOutfits,
  listPublishedOutfits,
  outfitsWithItemCounts,
} from "@/lib/queries";
import { probeImageDimensionsForOg, resolveShareImageUrl } from "@/lib/og-share-image";
import { absoluteUrl } from "@/lib/utils";
import type { Outfit } from "@/lib/db/schema";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedOutfitSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const outfit = await getPublishedOutfitBySlug(slug);
    if (!outfit) return { title: "Outfit not found" };
    const rawImage = outfit.mainImageUrl?.trim() || undefined;
    const ogImageUrl = rawImage ? resolveShareImageUrl(rawImage) : undefined;
    const ogDims = ogImageUrl ? await probeImageDimensionsForOg(ogImageUrl) : undefined;
    const url = absoluteUrl(`/outfits/${slug}`);
    const description =
      outfit.description.slice(0, 160) || `Shop the ${outfit.title} look on Femmely.`;
    const ogDescription = outfit.description.slice(0, 200);
    return {
      title: outfit.title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        title: outfit.title,
        description: ogDescription,
        url,
        images: ogImageUrl
          ? [{ url: ogImageUrl, alt: outfit.title, ...ogDims }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: outfit.title,
        description: ogDescription,
        images: ogImageUrl ? [ogImageUrl] : undefined,
      },
    };
  } catch {
    return { title: "Outfit" };
  }
}

export default async function OutfitPage({ params }: Props) {
  const { slug } = await params;
  let outfit: Outfit | null = null;
  try {
    outfit = await getPublishedOutfitBySlug(slug);
  } catch {
    /* DB unavailable */
  }
  if (!outfit) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-headline text-xl text-on-surface">Outfit not found</h1>
        <Link href="/outfits" className="mt-4 inline-block font-body text-primary transition-opacity hover:opacity-80">
          Back to outfits
        </Link>
      </div>
    );
  }

  const [items, cats, tgs] = await Promise.all([
    getOutfitItems(outfit.id),
    getOutfitCategories(outfit.id),
    getOutfitTags(outfit.id),
  ]);

  const liveList = await Promise.all(items.map((i) => getCachedAmazonItem(i.asin)));
  const displayItems = items.map((item, idx) => mergeItemDisplay(item, liveList[idx]));

  const categoryIds = cats.map((c) => c.category.id);
  const tagIds = tgs.map((t) => t.tag.id);
  const [featuredForCarousel, relatedRaw] = await Promise.all([
    listPublishedOutfits({
      featuredOnly: true,
      excludeOutfitId: outfit.id,
      limit: 12,
      sort: "newest",
    }),
    getRelatedOutfits(outfit.id, categoryIds, tagIds, 8),
  ]);
  let relatedCards = await outfitsWithItemCounts(
    relatedRaw.filter((o) => o.id !== outfit.id).slice(0, 6),
  );
  if (relatedCards.length === 0) {
    const fallback = await listPublishedOutfits({ limit: 8 });
    relatedCards = fallback.filter((r) => r.outfit.id !== outfit.id).slice(0, 6);
  }

  const itemRowNodes = displayItems.map((item) => (
    <OutfitItemRowCard
      key={item.id}
      imageUrl={item.primaryImageUrl}
      title={item.title}
      price_cents={item.priceCents}
      currency={item.currency}
      outfitSlug={slug}
      itemId={item.id}
      garmentCategory={item.garmentCategory}
      displayLabel={item.displayLabel}
      affiliateUrl={item.affiliateUrl}
    />
  ));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Outfits", item: absoluteUrl("/outfits") },
          {
            "@type": "ListItem",
            position: 3,
            name: outfit.title,
            item: absoluteUrl(`/outfits/${slug}`),
          },
        ],
      },
      {
        "@type": "ItemList",
        name: outfit.title,
        itemListElement: displayItems.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.title,
          url: absoluteUrl(`/outfits/${slug}/${it.id}`),
        })),
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
        <nav className="font-body text-sm text-on-surface-variant">
          <Link href="/" className="transition-opacity hover:text-primary hover:opacity-80">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/outfits" className="transition-opacity hover:text-primary hover:opacity-80">
            Outfits
          </Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface">{outfit.title}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="font-headline text-3xl font-bold text-on-surface md:text-4xl">{outfit.title}</h1>
          <BookmarkButton outfitId={outfit.id} size="md" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2 font-body text-sm text-on-surface-variant">
          {outfit.season ? (
            <span className="rounded-lg bg-surface-container px-2 py-1">{outfit.season}</span>
          ) : null}
          {outfit.occasion ? (
            <span className="rounded-lg bg-surface-container px-2 py-1">{outfit.occasion}</span>
          ) : null}
          {cats.map(({ category }) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-lg bg-primary/10 px-2 py-1 text-primary"
            >
              {category.name}
            </Link>
          ))}
          {tgs.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-lg bg-secondary-container px-2 py-1 text-secondary"
            >
              #{tag.name}
            </Link>
          ))}
        </div>

        {displayItems.length > 0 ? (
          outfit.mainImageUrl || outfit.description ? (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
              <div className="flex max-w-3xl flex-col gap-8 lg:max-w-none">
                {outfit.mainImageUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container shadow-card">
                    <Image
                      src={outfit.mainImageUrl}
                      alt={outfit.title}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                {outfit.description ? (
                  <div className="prose-description">
                    <Markdown remarkPlugins={[remarkGfm]}>{outfit.description}</Markdown>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">{itemRowNodes}</div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-4">{itemRowNodes}</div>
          )
        ) : (
          <>
            {outfit.mainImageUrl ? (
              <div className="relative mt-8 aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-xl bg-surface-container shadow-card">
                <Image
                  src={outfit.mainImageUrl}
                  alt={outfit.title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 800px"
                />
              </div>
            ) : null}
            {outfit.description ? (
              <div className="prose-description mt-8 max-w-3xl">
                <Markdown remarkPlugins={[remarkGfm]}>{outfit.description}</Markdown>
              </div>
            ) : null}
          </>
        )}

        {displayItems.length > 0 ? (
          <div className="mt-12">
            <AffiliateDisclosure />
          </div>
        ) : null}

        {relatedCards.length > 0 ? (
          <section className="mt-16 border-t border-outline-variant pt-16">
            <h2 className="font-headline text-xl text-on-surface">Related outfits</h2>
            <div className="mt-6">
              <MasonryGrid>
                {relatedCards.map(({ outfit: o, itemCount, cardImageUrl, primaryCategoryName }) => (
                  <OutfitCard
                    key={o.id}
                    outfit={o}
                    itemCount={itemCount}
                    cardImageUrl={cardImageUrl}
                    primaryCategoryName={primaryCategoryName}
                  />
                ))}
              </MasonryGrid>
            </div>
          </section>
        ) : null}

        {featuredForCarousel.length > 0 ? (
          <FeaturedOutfitsCarousel outfits={featuredForCarousel} />
        ) : null}
      </div>
    </article>
  );
}
