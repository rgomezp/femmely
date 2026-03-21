import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitCard } from "@/components/public/OutfitCard";
import { SearchBar, SearchBarSkeleton } from "@/components/public/SearchBar";
import { outfitsWithItemCounts, searchPublishedOutfits } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  if (!q) {
    return { title: "Search" };
  }
  return { title: `Search: ${q}` };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  let rows: Awaited<ReturnType<typeof outfitsWithItemCounts>> = [];
  if (q) {
    try {
      const outfits = await searchPublishedOutfits(q, 48);
      rows = await outfitsWithItemCounts(outfits);
    } catch {
      /* DB unavailable */
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
      <div className="max-w-2xl">
        <h1 className="font-headline text-2xl font-bold text-on-surface md:text-4xl">Search</h1>
        <p className="font-body mt-2 text-lg text-on-surface-variant leading-relaxed">
          Find boards by look name, category, tag, or product keywords.
        </p>
        <div className="relative mt-6">
          <Suspense fallback={<SearchBarSkeleton />}>
            <SearchBar className="relative w-full" inputId="search-page-q" autoFocus />
          </Suspense>
        </div>
      </div>

      {!q ? (
        <p className="font-body mt-10 text-center text-on-surface-variant">
          Type a query above and press Enter to see matching outfits.
        </p>
      ) : rows.length === 0 ? (
        <p className="font-body mt-10 text-center text-on-surface-variant">
          No outfits match &ldquo;{q}&rdquo;. Try different keywords or{" "}
          <Link href="/outfits" className="text-primary underline underline-offset-2 hover:opacity-90">
            browse all outfits
          </Link>
          .
        </p>
      ) : (
        <>
          <p className="font-body mt-8 text-on-surface-variant">
            {rows.length} {rows.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
          </p>
          <MasonryGrid className="mt-6">
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
        </>
      )}
    </div>
  );
}
