import { Suspense } from "react";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitCard } from "@/components/public/OutfitCard";
import { OutfitFilters } from "@/components/public/OutfitFilters";
import { listCategories, listPublishedOutfits } from "@/lib/queries";

export const revalidate = 86400;

type Props = {
  searchParams: Promise<{ sort?: string; season?: string; occasion?: string; category?: string }>;
};

export default async function OutfitsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sort = (sp.sort as "newest" | "items" | "title") || "newest";
  let rows: Awaited<ReturnType<typeof listPublishedOutfits>> = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  try {
    [rows, categories] = await Promise.all([
      listPublishedOutfits({
        sort,
        season: sp.season,
        occasion: sp.occasion,
        categorySlug: sp.category,
        limit: 48,
      }),
      listCategories(),
    ]);
  } catch {
    /* DB unavailable */
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
      <h1 className="font-headline text-2xl font-bold text-on-surface md:text-4xl">All outfits</h1>
      <p className="font-body mt-2 text-lg text-on-surface-variant leading-relaxed">
        Filter and browse curated boards.
      </p>

      <Suspense fallback={null}>
        <OutfitFilters categories={categories} />
      </Suspense>

      <MasonryGrid className="mt-6 md:mt-8">
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
        <p className="mt-8 text-center font-body text-on-surface-variant">No outfits match these filters yet.</p>
      ) : null}
    </div>
  );
}
