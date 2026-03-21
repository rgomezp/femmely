import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const outfitStatusEnum = pgEnum("outfit_status", ["draft", "published"]);

export const outfits = pgTable(
  "outfits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description").notNull().default(""),
    heroImageUrl: text("hero_image_url").notNull(),
    heroImageAlt: varchar("hero_image_alt", { length: 255 }).notNull().default(""),
    status: outfitStatusEnum("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    season: varchar("season", { length: 50 }),
    occasion: varchar("occasion", { length: 100 }),
    sortOrder: integer("sort_order").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("outfits_status_featured_idx").on(t.status, t.featured),
    index("outfits_published_at_desc_idx").on(t.publishedAt),
  ],
);

export const outfitItems = pgTable(
  "outfit_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    outfitId: uuid("outfit_id")
      .notNull()
      .references(() => outfits.id, { onDelete: "cascade" }),
    asin: varchar("asin", { length: 20 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    affiliateUrl: text("affiliate_url").notNull(),
    imageUrl: text("image_url").notNull(),
    priceCents: integer("price_cents"),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    displayLabel: varchar("display_label", { length: 100 }).notNull().default("Item"),
    garmentCategory: varchar("garment_category", { length: 50 }).notNull().default("none"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("outfit_items_outfit_id_idx").on(t.outfitId),
    index("outfit_items_asin_idx").on(t.asin),
  ],
);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull().default(""),
  coverImageUrl: text("cover_image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const outfitCategories = pgTable(
  "outfit_categories",
  {
    outfitId: uuid("outfit_id")
      .notNull()
      .references(() => outfits.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.outfitId, t.categoryId] })],
);

export const outfitTags = pgTable(
  "outfit_tags",
  {
    outfitId: uuid("outfit_id")
      .notNull()
      .references(() => outfits.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.outfitId, t.tagId] })],
);

export type Outfit = typeof outfits.$inferSelect;
export type NewOutfit = typeof outfits.$inferInsert;
export type OutfitItem = typeof outfitItems.$inferSelect;
export type NewOutfitItem = typeof outfitItems.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;
