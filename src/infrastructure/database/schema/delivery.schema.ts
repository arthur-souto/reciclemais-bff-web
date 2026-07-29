import { integer, pgEnum, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
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
    weight: integer(),
    total_score: integer(),
    evidence_url: varchar("evidence_url", { length: 2048 }),
    collected_at: timestamp("collected_at", { mode: "date" }),
    latitude: integer(),
    longitude: integer(),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
    fk_user: uuid("fk_user").references(() => usersTable.id),
    fk_material: integer("fk_material").references(() => materialTable.id),
    fk_approved_by: uuid("fk_approved_by").references(() => usersTable.id)
})

export type DeliveryRow = typeof deliveryTable.$inferSelect;
export type NewDeliveryRow = typeof deliveryTable.$inferInsert;
