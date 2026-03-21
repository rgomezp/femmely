import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ItemCard } from "@/components/public/ItemCard";
import { AffiliateDisclosure } from "@/components/public/AffiliateDisclosure";
import { OutfitCard } from "@/components/public/OutfitCard";
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
    const url = absoluteUrl(`/outfits/${slug}`);
    return {
      title: outfit.title,
      description: outfit.description.slice(0, 160) || `Shop the ${outfit.title} look on Femmely.`,
      alternates: { canonical: url },
      openGraph: {
        title: outfit.title,
        description: outfit.description.slice(0, 200),
        url,
        images: outfit.heroImageUrl ? [{ url: outfit.heroImageUrl, alt: outfit.heroImageAlt }] : undefined,
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
        <h1 className="text-xl font-semibold">Outfit not found</h1>
        <Link href="/outfits" className="mt-4 inline-block text-[var(--color-accent)]">
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

  const grouped = new Map<string, typeof displayItems>();
  for (const it of displayItems) {
    const k = it.displayLabel || "Items";
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(it);
  }

  const categoryIds = cats.map((c) => c.category.id);
  const tagIds = tgs.map((t) => t.tag.id);
  const relatedRaw = await getRelatedOutfits(outfit.id, categoryIds, tagIds, 8);
  let relatedCards = await outfitsWithItemCounts(
    relatedRaw.filter((o) => o.id !== outfit.id).slice(0, 6),
  );
  if (relatedCards.length === 0) {
    const fallback = await listPublishedOutfits({ limit: 8 });
    relatedCards = fallback.filter((r) => r.outfit.id !== outfit.id).slice(0, 6);
  }

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
        "@type": "ImageObject",
        contentUrl: outfit.heroImageUrl,
        name: outfit.heroImageAlt || outfit.title,
      },
      ...displayItems.map((it) => ({
        "@type": "Product",
        name: it.title,
        image: it.imageUrl,
        offers: it.priceCents
          ? {
              "@type": "Offer",
              priceCurrency: it.currency,
              price: (it.priceCents / 100).toFixed(2),
              url: it.affiliateUrl,
            }
          : undefined,
      })),
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative aspect-[16/10] w-full bg-[var(--color-bg)] md:aspect-[21/9]">
        <Image
          src={outfit.heroImageUrl}
          alt={outfit.heroImageAlt || outfit.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-6">
        <nav className="text-sm text-[var(--color-text-secondary)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/outfits" className="hover:text-[var(--color-accent)]">
            Outfits
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-primary)]">{outfit.title}</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-primary)]">{outfit.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--color-text-secondary)]">
          {outfit.season ? <span className="rounded-lg bg-[var(--color-bg)] px-2 py-1">{outfit.season}</span> : null}
          {outfit.occasion ? (
            <span className="rounded-lg bg-[var(--color-bg)] px-2 py-1">{outfit.occasion}</span>
          ) : null}
          {cats.map(({ category }) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-lg bg-[var(--color-accent)]/10 px-2 py-1 text-[var(--color-accent)]"
            >
              {category.name}
            </Link>
          ))}
          {tgs.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-lg bg-[var(--color-accent-secondary)]/10 px-2 py-1 text-[var(--color-accent-secondary)]"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        {outfit.description ? (
          <div className="prose-description mt-6 max-w-3xl">
            <Markdown remarkPlugins={[remarkGfm]}>{outfit.description}</Markdown>
          </div>
        ) : null}
        <div className="mt-8">
          <AffiliateDisclosure />
        </div>

        {[...grouped.entries()].map(([label, list]) => (
          <section key={label} className="mt-12">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{label}</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}

        {relatedCards.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Related outfits</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCards.map(({ outfit: o, itemCount }) => (
                <OutfitCard key={o.id} outfit={o} itemCount={itemCount} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
