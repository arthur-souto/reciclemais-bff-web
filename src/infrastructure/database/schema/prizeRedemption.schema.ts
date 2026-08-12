import { pgTable, serial, integer, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";
import { prizeTable } from "./prize.schema";

export const prizeRedemptionTable = pgTable("prize_redemptions", {
    id: serial("id").primaryKey(),
    fk_prize: integer("fk_prize").notNull().references(() => prizeTable.id),
    fk_user: uuid("fk_user").notNull().references(() => usersTable.id),
    redeemed_at: timestamp("redeemed_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
    unique("uq_user_prize").on(table.fk_user, table.fk_prize),
]);

export type PrizeRedemptionRow = typeof prizeRedemptionTable.$inferSelect;
export type NewPrizeRedemptionRow = typeof prizeRedemptionTable.$inferInsert;