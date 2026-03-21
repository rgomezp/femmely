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
  mainImageUrl: z.string().default(""),
  status: outfitStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  season: z.string().max(50).optional().nullable(),
  occasion: z.string().max(100).optional().nullable(),
  sortOrder: z.number().int().default(0),
  categoryIds: z.array(z.string().uuid()).default([]),
  tagIds: z.array(z.string().uuid()).default([]),
});

/** PATCH-style: no field defaults — omitted keys must stay omitted so partial PUTs don't wipe data. */
export const updateOutfitSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  mainImageUrl: z.string().optional(),
  status: outfitStatusSchema.optional(),
  featured: z.boolean().optional(),
  season: z.string().max(50).optional().nullable(),
  occasion: z.string().max(100).optional().nullable(),
  sortOrder: z.number().int().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
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
