ALTER TABLE "outfits" ADD COLUMN "main_image_url" text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE "outfits" AS o
SET "main_image_url" = COALESCE(NULLIF(TRIM(sub.thumb), ''), '')
FROM (
  SELECT DISTINCT ON ("outfit_id") "outfit_id",
    COALESCE(NULLIF(TRIM("item_image_url"), ''), "image_url") AS thumb
  FROM "outfit_items"
  ORDER BY "outfit_id", "sort_order" ASC, "created_at" ASC
) AS sub
WHERE o.id = sub.outfit_id AND (o.main_image_url = '' OR o.main_image_url IS NULL);--> statement-breakpoint
ALTER TABLE "outfit_items" DROP COLUMN "item_image_url";
