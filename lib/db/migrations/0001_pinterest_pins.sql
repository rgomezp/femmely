ALTER TABLE "outfit_items" ADD COLUMN "item_image_url" text;--> statement-breakpoint
UPDATE "outfit_items" SET "item_image_url" = "image_url" WHERE "item_image_url" IS NULL;--> statement-breakpoint
ALTER TABLE "outfit_items" ALTER COLUMN "item_image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "outfits" DROP COLUMN "hero_image_url";--> statement-breakpoint
ALTER TABLE "outfits" DROP COLUMN "hero_image_alt";
