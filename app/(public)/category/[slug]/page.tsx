import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitCard } from "@/components/public/OutfitCard";
import { db, categories } from "@/lib/db";
import type { Category } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getCategorySlugs, listPublishedOutfits } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await getCategorySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const row = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    const cat = row[0];
    if (!cat) return { title: "Category" };
    const url = absoluteUrl(`/category/${slug}`);
    return {
      title: cat.name,
      description: cat.description.slice(0, 160) || `Browse ${cat.name} outfits on Femmely.`,
      alternates: { canonical: url },
      openGraph: { title: cat.name, url },
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  let cat: Category | undefined;
  let rows: Awaited<ReturnType<typeof listPublishedOutfits>> = [];
  try {
    const row = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    cat = row[0];
    if (cat) rows = await listPublishedOutfits({ categorySlug: slug, limit: 48 });
  } catch {
    notFound();
  }
  if (!cat) notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
      <h1 className="font-headline text-2xl font-bold text-on-surface md:text-4xl">{cat.name}</h1>
      {cat.description ? (
        <p className="font-body mt-2 max-w-2xl text-on-surface-variant">{cat.description}</p>
      ) : null}
      <MasonryGrid>
        {rows.map(({ outfit, itemCount, cardImageUrl }) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            itemCount={itemCount}
            cardImageUrl={cardImageUrl}
            categoryName={cat.name}
          />
        ))}
      </MasonryGrid>
      {rows.length === 0 ? (
        <p className="mt-8 font-body text-on-surface-variant">No outfits in this category yet.</p>
      ) : null}
    </div>
  );
}
