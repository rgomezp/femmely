import { z } from "zod";

export const garmentCategorySchema = z.enum([
  "shoes",
  "tops",
  "bottoms-pants",
  "bottoms-skirts",
  "dresses",
  "bras",
  "underwear",
  "outerwear",
  "activewear",
  "swimwear",
  "hosiery",
  "none",
]);

export const outfitStatusSchema = z.enum(["draft", "published"]);

export const createOutfitSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().default(""),
  heroImageUrl: z.string().min(1),
  heroImageAlt: z.string().max(255).default(""),
  status: outfitStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  season: z.string().max(50).optional().nullable(),
  occasion: z.string().max(100).optional().nullable(),
  sortOrder: z.number().int().default(0),
  categoryIds: z.array(z.string().uuid()).default([]),
  tagIds: z.array(z.string().uuid()).default([]),
});

export const updateOutfitSchema = createOutfitSchema.partial().extend({
  title: z.string().min(1).max(255).optional(),
});

export const outfitItemInputSchema = z.object({
  asin: z.string().min(10).max(20),
  title: z.string().min(1).max(255),
  affiliateUrl: z.string().min(1),
  imageUrl: z.string().min(1),
  priceCents: z.number().int().nullable().optional(),
  currency: z.string().length(3).default("USD"),
  displayLabel: z.string().max(100).default("Item"),
  garmentCategory: garmentCategorySchema.default("none"),
  sortOrder: z.number().int().default(0),
});
