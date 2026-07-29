ALTER TABLE "deliveries" ALTER COLUMN "collected_at" SET DATA TYPE timestamp USING to_timestamp("collected_at")::timestamp;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "created_at" SET DATA TYPE timestamp USING to_timestamp("created_at")::timestamp;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "updated_at" SET DATA TYPE timestamp USING to_timestamp("updated_at")::timestamp;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "updated_at" SET DEFAULT now();