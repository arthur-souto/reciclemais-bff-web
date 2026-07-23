import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";


export const adminTable = pgTable("admins", {
    id: uuid("id").primaryKey().defaultRandom(),
    password: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 100 }).notNull(),
})

export type AdminRow = typeof adminTable.$inferSelect;
export type NewAdminRow = typeof adminTable.$inferInsert;