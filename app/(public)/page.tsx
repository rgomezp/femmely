import Image from "next/image";
import Link from "next/link";
import { CategoryBar } from "@/components/public/CategoryBar";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitCard } from "@/components/public/OutfitCard";
import { listCategories, listPublishedOutfits } from "@/lib/queries";

export const revalidate = 86400;

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let grid: Awaited<ReturnType<typeof listPublishedOutfits>> = [];
  try {
    [categories, grid] = await Promise.all([
      listCategories(),
      listPublishedOutfits({ limit: 12, offset: 0, sort: "newest" }),
    ]);
  } catch {
    /* Database unavailable at build or misconfigured DATABASE_URL */
  }

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-4 pb-16 md:px-6">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl font-bold tracking-tight leading-tight text-on-surface md:text-7xl">
              Your guide to <span className="font-normal italic">femme</span> fashion
            </h1>
            <p className="font-body mt-6 max-w-md text-lg leading-relaxed text-on-surface-variant">
              Browse styled looks and use our sizing translator when you need a women&apos;s
              size starting point from your measurements.
            </p>
            <Link
              href="/outfits"
              className="font-label mt-10 inline-flex items-center rounded-full bg-gradient-to-br from-primary to-primary-container px-8 py-4 text-xs uppercase tracking-widest text-on-primary shadow-lg transition hover:opacity-90"
            >
              Explore outfits
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 pb-12 md:px-6">
        <h2 className="font-headline text-xl text-on-surface">Shop by category</h2>
        <div className="mt-4">
          <CategoryBar categories={categories} />
        </div>

        <h2 className="font-headline mt-10 text-xl text-on-surface md:mt-12">Latest outfits</h2>
        <div className="mt-6 md:mt-8">
          <MasonryGrid>
            {grid.map(({ outfit, itemCount, cardImageUrl, primaryCategoryName }) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                itemCount={itemCount}
                cardImageUrl={cardImageUrl}
                primaryCategoryName={primaryCategoryName}
              />
            ))}
          </MasonryGrid>
        </div>
        {grid.length === 0 ? (
          <p className="mt-8 text-center font-body text-on-surface-variant">
            Outfits will appear here once published from the admin dashboard.
          </p>
        ) : (
          <div className="mt-12 text-center">
            <Link
              href="/outfits"
              className="font-label inline-flex items-center rounded-xl border border-outline-variant px-6 py-3 text-xs uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-high"
            >
              View all outfits
            </Link>
          </div>
        )}
      </div>

      <section className="mx-auto mt-32 max-w-[1400px] px-4 md:px-6">
        <div className="rounded-xl bg-surface-container-low p-6 md:p-12">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="max-w-xl flex-1">
              <p className="font-label text-[10px] uppercase tracking-widest text-primary">Precision Styling</p>
              <h2 className="font-headline mt-3 text-4xl text-on-surface">Find your fit with confidence</h2>
              <p className="font-body mt-4 text-lg leading-relaxed text-on-surface-variant">
                Practical men&apos;s-to-women&apos;s sizing starting points for shoes, apparel, and more.
              </p>
              <Link
                href="/size-guide"
                className="font-label mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-[10px] uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
              >
                Open size guide
              </Link>
            </div>
            <div className="relative w-full flex-1 overflow-hidden rounded-xl md:min-h-[280px]">
              <Image
                src="https://images.pexels.com/photos/36347508/pexels-photo-36347508.jpeg"
                alt=""
                width={900}
                height={600}
                className="h-full min-h-[220px] w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-primary/10 mix-blend-overlay"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
