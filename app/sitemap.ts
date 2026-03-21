import type { MetadataRoute } from "next";
import { SIZING_CATEGORY_SLUGS } from "@/lib/sizing/types";
import {
  getCategorySlugs,
  getPublishedOutfitItemRoutes,
  getPublishedOutfitSlugs,
  getTagSlugs,
} from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/outfits",
    "/size-guide",
    "/about",
    "/privacy",
    "/disclosure",
  ].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: now,
  }));

  let outfitSlugs: string[] = [];
  let catSlugs: string[] = [];
  let tagSlugs: string[] = [];
  let outfitItems: { slug: string; itemId: string }[] = [];
  try {
    [outfitSlugs, catSlugs, tagSlugs, outfitItems] = await Promise.all([
      getPublishedOutfitSlugs(),
      getCategorySlugs(),
      getTagSlugs(),
      getPublishedOutfitItemRoutes(),
    ]);
  } catch {
    /* DB may be unavailable at build */
  }

  const outfits = outfitSlugs.map((slug) => ({
    url: absoluteUrl(`/outfits/${slug}`),
    lastModified: now,
  }));
  const itemPages = outfitItems.map(({ slug, itemId }) => ({
    url: absoluteUrl(`/outfits/${slug}/${itemId}`),
    lastModified: now,
  }));
  const cats = catSlugs.map((slug) => ({
    url: absoluteUrl(`/category/${slug}`),
    lastModified: now,
  }));
  const tgs = tagSlugs.map((slug) => ({
    url: absoluteUrl(`/tag/${slug}`),
    lastModified: now,
  }));
  const size = SIZING_CATEGORY_SLUGS.map((category) => ({
    url: absoluteUrl(`/size-guide/${category}`),
    lastModified: now,
  }));

  return [...staticRoutes, ...outfits, ...itemPages, ...cats, ...tgs, ...size];
}
