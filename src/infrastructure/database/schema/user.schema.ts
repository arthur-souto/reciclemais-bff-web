import {integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["USER", "ADMIN", "ASSOCIATE"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  cpf: varchar({length: 11}).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: userRole("role").default("USER").notNull(),
  profile_image: varchar({length: 2048}),
  phone: varchar({length: 20}),
  cep: varchar({length: 8}),
  address: varchar({length: 255}),
  total_score: integer().default(0).notNull(),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export type UserRow = typeof usersTable.$inferSelect;
export type NewUserRow = typeof usersTable.$inferInsert;