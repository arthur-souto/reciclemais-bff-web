CREATE TYPE "prize_type" AS ENUM('PHYSICAL', 'DIGITAL', 'DISCOUNT');--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "quantity" integer;--> statement-breakpoint
ALTER TABLE "prizes" ADD COLUMN "type" "prize_type" DEFAULT 'PHYSICAL'::"prize_type" NOT NULL;