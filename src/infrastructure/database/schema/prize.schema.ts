import { pgTable, integer, varchar, text, serial, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export const prizeStatus = pgEnum("prize_status", ["ACTIVE", "INACTIVE"]);

export const prizeTable = pgTable("prizes", {
    id: serial("id").primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    required_points: integer().notNull(),
    image_url: varchar("image_url", { length: 2048 }),
    description: text().notNull(),
    status: prizeStatus("status").default("ACTIVE").notNull(),
    category: varchar({ length: 100 }),
    expiration_date: timestamp("expiration_date", { mode: "date" }),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
    fk_created_by: uuid("fk_user").references(() => usersTable.id),
})

export type PrizeRow = typeof prizeTable.$inferSelect;
export type NewPrizeRow = typeof prizeTable.$inferInsert;
