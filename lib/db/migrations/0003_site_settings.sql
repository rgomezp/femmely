CREATE TABLE "site_settings" (
  "id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
  "amazon_partner_tag_override" text,
  CONSTRAINT "site_settings_singleton" CHECK ("id" = 1)
);
