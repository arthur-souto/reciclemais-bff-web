import { pgTable, integer, varchar, text, serial, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export const prizeTable = pgTable("prizes", {
    id: serial("id").primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    required_points: integer().notNull(),
    description: text().notNull(),
    fk_user: uuid("fk_user").references(() => usersTable.id),
})

export type PrizeRow = typeof prizeTable.$inferSelect;
export type NewPrizeRow = typeof prizeTable.$inferInsert;
