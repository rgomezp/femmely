CREATE TYPE "public"."outfit_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"cover_image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "outfit_categories" (
	"outfit_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "outfit_categories_outfit_id_category_id_pk" PRIMARY KEY("outfit_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "outfit_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outfit_id" uuid NOT NULL,
	"asin" varchar(20) NOT NULL,
	"title" varchar(255) NOT NULL,
	"affiliate_url" text NOT NULL,
	"image_url" text NOT NULL,
	"price_cents" integer,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"display_label" varchar(100) DEFAULT 'Item' NOT NULL,
	"garment_category" varchar(50) DEFAULT 'none' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outfit_tags" (
	"outfit_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "outfit_tags_outfit_id_tag_id_pk" PRIMARY KEY("outfit_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "outfits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"hero_image_url" text NOT NULL,
	"hero_image_alt" varchar(255) DEFAULT '' NOT NULL,
	"status" "outfit_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"season" varchar(50),
	"occasion" varchar(100),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outfits_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "outfit_categories" ADD CONSTRAINT "outfit_categories_outfit_id_outfits_id_fk" FOREIGN KEY ("outfit_id") REFERENCES "public"."outfits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_categories" ADD CONSTRAINT "outfit_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_outfit_id_outfits_id_fk" FOREIGN KEY ("outfit_id") REFERENCES "public"."outfits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_tags" ADD CONSTRAINT "outfit_tags_outfit_id_outfits_id_fk" FOREIGN KEY ("outfit_id") REFERENCES "public"."outfits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_tags" ADD CONSTRAINT "outfit_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "outfit_items_outfit_id_idx" ON "outfit_items" USING btree ("outfit_id");--> statement-breakpoint
CREATE INDEX "outfit_items_asin_idx" ON "outfit_items" USING btree ("asin");--> statement-breakpoint
CREATE INDEX "outfits_status_featured_idx" ON "outfits" USING btree ("status","featured");--> statement-breakpoint
CREATE INDEX "outfits_published_at_desc_idx" ON "outfits" USING btree ("published_at");