ALTER TABLE "users" ADD COLUMN "cpf" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_cpf_key" UNIQUE("cpf");