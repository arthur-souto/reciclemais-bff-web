import { integer, pgEnum, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";
import { materialTable } from "./material.schema";

export const activityStatus = pgEnum("status", [
    "PENDING",
    "COMPLETED",
    "CANCELED",
])

export const deliveryTable = pgTable("deliveries", {
    id: serial("id").primaryKey(),
    local: varchar({ length: 255 }).notNull(),
    material_type: varchar({ length: 255 }).notNull(),
    status: activityStatus("status").default("PENDING").notNull(),
    quantity: integer().notNull(),
    evidence_url: varchar("evidence_url", { length: 2048 }),
    fk_user: uuid("fk_user").references(() => usersTable.id),
    fk_material: integer("fk_material").references(() => materialTable.id),
})

export type DeliveryRow = typeof deliveryTable.$inferSelect;
export type NewDeliveryRow = typeof deliveryTable.$inferInsert;
