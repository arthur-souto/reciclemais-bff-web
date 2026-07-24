import { integer, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export const materialTable = pgTable("materials", {
    id: serial("id").primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    importance: integer().notNull(),
    points_value: integer().notNull(),
    fk_user: uuid("fk_user").references(() => usersTable.id),
})

export type MaterialRow = typeof materialTable.$inferSelect;
export type NewMaterialRow = typeof materialTable.$inferInsert;
