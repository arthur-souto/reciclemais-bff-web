import { varchar } from "drizzle-orm/cockroach-core";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { adminTable } from "./admin.schema";


export const materialTable = pgTable("materials", {
    id: serial("id").primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    importance: integer().notNull(),
    points_value: integer().notNull(),
    fk_admin: integer("fk_admin").references(() => adminTable.id)
})

export type MaterialRow = typeof materialTable.$inferSelect;
export type NewMaterialRow = typeof materialTable.$inferInsert;