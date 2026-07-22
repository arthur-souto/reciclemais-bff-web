import { pgTable, integer, varchar, text, serial } from "drizzle-orm/pg-core";
import { adminTable } from "./admin.schema";


export const prizeTable = pgTable("prizes", {
    id: serial("id").primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    required_points: integer().notNull(),
    description: text().notNull(),
    fk_admin: integer("fk_admin").references(() => adminTable.id),

})

export type PrizeRow = typeof prizeTable.$inferSelect;
export type NewPrizeRow = typeof prizeTable.$inferInsert;