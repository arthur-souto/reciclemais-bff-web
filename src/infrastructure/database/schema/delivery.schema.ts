import { integer, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";
import { materialTable } from "./material.schema";

export const activityStatus = pgEnum("status", [
    "PENDING",
    "COMPLETED",
    "CANCELED",
])

export const deliveryTable = pgTable("deliverys", {
    id: serial("id").primaryKey(),
    local: varchar({ length: 255 }).notNull(),
    material_type: varchar({ length: 255 }).notNull(),
    status: activityStatus("status").default("PENDING").notNull(),
    quantity: integer().notNull(),
    fk_user: integer("fk_user").references(() => usersTable.id),
    fk_material: integer("fk_material").references(() => materialTable.id),

})

export type DeliveryRow = typeof deliveryTable.$inferSelect;
export type NewDeliveryRow = typeof deliveryTable.$inferInsert;