CREATE TYPE "status" AS ENUM('PENDING', 'COMPLETED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" serial PRIMARY KEY,
	"local" varchar(255) NOT NULL,
	"material_type" varchar(255) NOT NULL,
	"status" "status" DEFAULT 'PENDING'::"status" NOT NULL,
	"quantity" integer NOT NULL,
	"evidence_url" varchar(2048),
	"fk_user" uuid,
	"fk_material" integer
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"importance" integer NOT NULL,
	"points_value" integer NOT NULL,
	"fk_user" uuid
);
--> statement-breakpoint
CREATE TABLE "prizes" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"required_points" integer NOT NULL,
	"description" text NOT NULL,
	"fk_user" uuid
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'USER'::"user_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk_user_users_id_fkey" FOREIGN KEY ("fk_user") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk_material_materials_id_fkey" FOREIGN KEY ("fk_material") REFERENCES "materials"("id");--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_fk_user_users_id_fkey" FOREIGN KEY ("fk_user") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_fk_user_users_id_fkey" FOREIGN KEY ("fk_user") REFERENCES "users"("id");