CREATE TYPE "prize_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "prize_redemptions" (
	"id" serial PRIMARY KEY,
	"fk_prize" integer NOT NULL,
	"fk_user" uuid NOT NULL,
	"redeemed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "image_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "status" "prize_status" DEFAULT 'ACTIVE'::"prize_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "expiration_date" timestamp;--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "prize_redemptions" ADD CONSTRAINT "prize_redemptions_fk_prize_prizes_id_fkey" FOREIGN KEY ("fk_prize") REFERENCES "prizes"("id");--> statement-breakpoint
ALTER TABLE "prize_redemptions" ADD CONSTRAINT "prize_redemptions_fk_user_users_id_fkey" FOREIGN KEY ("fk_user") REFERENCES "users"("id");