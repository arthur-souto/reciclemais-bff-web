ALTER TABLE "deliveries" ADD COLUMN "weight" integer;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "total_score" integer;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "collected_at" integer;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "latitude" integer;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "longitude" integer;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "created_at" integer;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "updated_at" integer;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "fk_approved_by" uuid;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk_approved_by_users_id_fkey" FOREIGN KEY ("fk_approved_by") REFERENCES "users"("id");