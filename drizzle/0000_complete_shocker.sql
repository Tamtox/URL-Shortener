CREATE TABLE "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_url" text NOT NULL,
	"original_url" text NOT NULL,
	"usage_count" numeric DEFAULT '0' NOT NULL,
	"ips" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"valid_until" timestamp,
	CONSTRAINT "urls_short_url_unique" UNIQUE("short_url"),
	CONSTRAINT "urls_original_url_unique" UNIQUE("original_url")
);
