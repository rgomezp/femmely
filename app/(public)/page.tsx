import Image from "next/image";
import Link from "next/link";
import { CategoryBar } from "@/components/public/CategoryBar";
import { MasonryGrid } from "@/components/public/MasonryGrid";
import { OutfitCard } from "@/components/public/OutfitCard";
import {
  getFeaturedOutfit,
  listCategories,
  listPublishedOutfits,
} from "@/lib/queries";
import type { Outfit } from "@/lib/db/schema";

export const revalidate = 86400;

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let featured: Outfit | null = null;
  let grid: Awaited<ReturnType<typeof listPublishedOutfits>> = [];
  try {
    [categories, featured, grid] = await Promise.all([
      listCategories(),
      getFeaturedOutfit(),
      listPublishedOutfits({ limit: 12, offset: 0, sort: "newest" }),
    ]);
  } catch {
    /* Database unavailable at build or misconfigured DATABASE_URL */
  }

  const hero = featured ?? grid[0]?.outfit;

  return (
    <div className="pb-16">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-[1400px] px-4 py-10 md:flex md:items-center md:gap-12 md:px-6 md:py-14">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
              Femmely.club
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              Outfit boards you can actually shop
            </h1>
            <p className="mt-4 text-[var(--color-text-secondary)]">
              Browse styled looks, tap through to Amazon, and use our sizing translator when you need a women&apos;s
              size starting point from your measurements.
            </p>
            <Link
              href="/size-guide"
              className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-accent-secondary)] underline-offset-4 hover:underline"
            >
              New to women&apos;s sizing? Try our size guide →
            </Link>
          </div>
          {hero ? (
            <Link
              href={`/outfits/${hero.slug}`}
              className="mt-8 block flex-1 overflow-hidden rounded-[12px] border border-[var(--color-border)] shadow-[var(--shadow-card)] md:mt-0"
            >
              <div className="relative aspect-[4/5] w-full max-w-md md:max-w-none">
                <Image
                  src={hero.heroImageUrl}
                  alt={hero.heroImageAlt || hero.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="font-semibold text-white">{hero.title}</p>
                  <p className="text-sm text-white/90">Featured look</p>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 pt-8 md:px-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Shop by category</h2>
        <div className="mt-4">
          <CategoryBar categories={categories} />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Latest outfits</h2>
        <MasonryGrid>
          {grid.map(({ outfit, itemCount }) => (
            <OutfitCard key={outfit.id} outfit={outfit} itemCount={itemCount} />
          ))}
        </MasonryGrid>
        {grid.length === 0 ? (
          <p className="mt-8 text-center text-[var(--color-text-secondary)]">
            Outfits will appear here once published from the admin dashboard.
          </p>
        ) : (
          <div className="mt-10 text-center">
            <Link
              href="/outfits"
              className="inline-flex min-h-11 items-center rounded-[12px] border border-[var(--color-border)] px-6 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
            >
              View all outfits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
