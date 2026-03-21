import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitCard } from "@/components/public/OutfitCard";
import { db, tags } from "@/lib/db";
import type { Tag } from "@/lib/db/schema";
import { getTagSlugs, listPublishedOutfits } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await getTagSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const row = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
    const tag = row[0];
    if (!tag) return { title: "Tag" };
    const url = absoluteUrl(`/tag/${slug}`);
    return {
      title: `#${tag.name}`,
      description: `Outfits tagged ${tag.name} on Femmely.`,
      alternates: { canonical: url },
      openGraph: { title: `#${tag.name}`, url },
    };
  } catch {
    return { title: "Tag" };
  }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  let tag: Tag | undefined;
  let rows: Awaited<ReturnType<typeof listPublishedOutfits>> = [];
  try {
    const row = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
    tag = row[0];
    if (tag) rows = await listPublishedOutfits({ tagSlug: slug, limit: 48 });
  } catch {
    notFound();
  }
  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
      <h1 className="font-headline text-2xl font-bold text-on-surface md:text-4xl">#{tag.name}</h1>
      <MasonryGrid className="mt-8">
        {rows.map(({ outfit, itemCount, cardImageUrl, primaryCategoryName }) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            itemCount={itemCount}
            cardImageUrl={cardImageUrl}
            primaryCategoryName={primaryCategoryName}
          />
        ))}
      </MasonryGrid>
      {rows.length === 0 ? (
        <p className="mt-8 font-body text-on-surface-variant">No outfits with this tag yet.</p>
      ) : null}
    </div>
  );
}
